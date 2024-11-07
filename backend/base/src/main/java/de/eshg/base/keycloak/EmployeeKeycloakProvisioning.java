/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.EmployeeKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ACCOUNT_CONSOLE_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ADMIN_CLI_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.BROKER_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.REALM_MANAGEMENT_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SECURITY_ADMIN_CONSOLE_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_ID_PREFIX;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_NAME_PREFIX;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.getClientRepresentationAttributes;

import com.google.common.annotations.VisibleForTesting;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.CollectionUtils;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.*;
import de.eshg.mutex.MutexService;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * The purpose of this component is to encapsulate ESHG-specific logic for provisioning Keycloak.
 */
@Component(BEAN_NAME)
public class EmployeeKeycloakProvisioning extends KeycloakProvisioning<EmployeeKeycloakClient> {

  public static final String BEAN_NAME = "employeeKeycloakProvisioning";
  public static final String CUSTOM_BROWSER_FLOW_ALIAS = "custom browser flow";
  private final URI synapseUrl;
  private final String synapseClientSecret;

  public EmployeeKeycloakProvisioning(
      EmployeeKeycloakClient employeeKeycloakClient,
      KeycloakProperties keycloakProperties,
      @Value("${eshg.employee-portal.reverse-proxy.url}") URI reverseProxyUrl,
      @Value("${eshg.synapse.url:}") URI synapseUrl,
      @Value("${eshg.synapse.client.secret:}") String synapseClientSecret,
      MutexService mutexService) {
    super(
        employeeKeycloakClient,
        keycloakProperties,
        reverseProxyUrl,
        keycloakProperties.employeeRealm(),
        mutexService);
    this.synapseUrl = synapseUrl;
    this.synapseClientSecret = synapseClientSecret;
  }

  @VisibleForTesting
  @Override
  public void provisionRealmInternal() {
    createOrUpdateRealm();

    EmployeePermissionRole[] permissionRoles = EmployeePermissionRole.values();
    createOrUpdateRoles(permissionRoles);
    createOrUpdateEshgClientScope(permissionRoles);
    createOrUpdateDefaultRoleComposites();
    createOrUpdateClients();
    createOrUpdateGroups();

    configureUserProfile(EmployeeUserAttribute.values());
    updateRequiredActions();
    configureLoginFlow();

    // Passwords are necessary for load testing, we only disable it in production environments
    if (!this.keycloakProperties.allowPasswordsForEmployees()) {
      disablePasswordPolicy();
    }
  }

  private void disablePasswordPolicy() {
    RealmResource realm = keycloakClient.getRealm();
    RealmRepresentation representation = realm.toRepresentation();
    representation.setPasswordPolicy(DISABLE_PASSWORD_POLICY);
    realm.update(representation);
  }

  private void createOrUpdateClients() {
    disableDefaultClients();

    Map<ModuleClient, String> configuredModuleClientSecrets = getConfiguredModuleClientSecrets();
    logUnconfiguredModuleClients(configuredModuleClientSecrets);

    List<ClientRepresentation> keycloakClients = new ArrayList<>();
    keycloakClients.add(buildEshgAuthServiceClient());
    keycloakClients.addAll(buildModuleClients(configuredModuleClientSecrets));
    if (StringUtils.isNotBlank(synapseClientSecret)) {
      keycloakClients.add(buildEshgSynapseClient());
    } else {
      log.info(
          "Secret for Synapse client have not been provided, therefore it will NOT be provisioned.");
    }

    keycloakClient.createOrUpdateClients(keycloakClients);
    keycloakClient.updateClientServiceAccountUserRoles(
        configuredModuleClientSecrets.keySet().stream()
            .map(this::buildServiceAccountUserRolesMap)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
  }

  private Map<ModuleClient, String> getConfiguredModuleClientSecrets() {
    return keycloakProperties.employeeRealm().moduleClientSecrets().entrySet().stream()
        .filter(EmployeeKeycloakProvisioning::isClientSecretConfigured)
        .collect(StreamUtil.toLinkedHashMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private void disableDefaultClients() {
    disableClients(
        Set.of(
            ACCOUNT_CONSOLE_CLIENT_ID,
            ADMIN_CLI_CLIENT_ID,
            BROKER_CLIENT_ID,
            SECURITY_ADMIN_CONSOLE_CLIENT_ID,
            REALM_MANAGEMENT_CLIENT_ID));
  }

  private Map.Entry<String, List<String>> buildServiceAccountUserRolesMap(
      ModuleClient moduleClient) {
    return Map.entry(
        moduleClient.getClientId(),
        moduleClient.getRoles().stream().map(EmployeePermissionRole::getKeycloakName).toList());
  }

  private void createOrUpdateGroups() {
    validateAllBusinessModulesHaveMemberGroups();

    List<GroupRepresentation> systemAdmins = KeycloakMapper.map(AdministrativeGroup.values());
    List<GroupRepresentation> technical = KeycloakMapper.map(TechnicalGroup.values());
    List<GroupRepresentation> leaders = KeycloakMapper.map(ModuleLeaderGroup.values());
    List<GroupRepresentation> modules = KeycloakMapper.map(ModuleMemberGroup.values());

    keycloakClient.createOrUpdateGroups(
        CollectionUtils.listUnion(List.of(systemAdmins, technical, leaders, modules)));
  }

  private void validateAllBusinessModulesHaveMemberGroups() {
    Stream.of(BusinessModule.values())
        .forEach(
            businessModule ->
                Assert.notNull(
                    KeycloakMapper.mapModuleToGroup(businessModule),
                    "Each business module must have a module member group"));
  }

  private void createOrUpdateRoles() {
    keycloakClient.createOrUpdateRoles(
        List.of(EmployeePermissionRole.values()), this::configureRole);
  }

  private void createOrUpdateDefaultRoleComposites() {
    keycloakClient.createOrUpdateDefaultRoleComposites(
        List.of(EmployeePermissionRole.STANDARD_EMPLOYEE));
  }

  private void updateRequiredActions() {
    keycloakClient.updateAuthenticationSettings(
        authentication -> {
          for (SecurityAction action : SecurityAction.values()) {
            log.info(
                "Updating action {} enabled={} default={}",
                action.name(),
                action.isEnabled(),
                action.isDefault());
            authentication.updateRequiredAction(action.getProviderId(), action.representation());
          }
        });
  }

  private ClientRepresentation buildEshgSynapseClient() {
    ClientRepresentation clientRepresentation = new ClientRepresentation();
    clientRepresentation.setClientId(SYSTEM_CLIENT_ID_PREFIX + "synapse");
    clientRepresentation.setName(SYSTEM_CLIENT_NAME_PREFIX + "Matrix Chat Client");
    clientRepresentation.setFrontchannelLogout(true);
    clientRepresentation.setWebOrigins(List.of("+"));
    clientRepresentation.setSecret(synapseClientSecret);
    clientRepresentation.setPublicClient(false);
    // default attributes, set for diffing
    clientRepresentation.setAttributes(
        Map.of(
            "backchannel.logout.revoke.offline.tokens", FALSE,
            "backchannel.logout.session.required", TRUE));
    UriComponentsBuilder redirectUriBuilder = UriComponentsBuilder.fromUri(synapseUrl);
    clientRepresentation.setRedirectUris(
        List.of(redirectUriBuilder.replacePath("_synapse/client/oidc/callback").toUriString()));

    return clientRepresentation;
  }

  private List<ClientRepresentation> buildModuleClients(
      Map<ModuleClient, String> moduleClientSecrets) {
    return moduleClientSecrets.entrySet().stream().map(this::buildModuleClient).toList();
  }

  private void logUnconfiguredModuleClients(
      Map<ModuleClient, String> configuredModuleClientSecrets) {
    String unconfiguredClientIds = getUnconfiguredClientIdsAsString(configuredModuleClientSecrets);
    if (StringUtils.isNotBlank(unconfiguredClientIds)) {
      log.info(
          "Secrets for some module clients have not been provided. The following clients will therefore NOT be provisioned:\n{}",
          unconfiguredClientIds);
    }
  }

  private static String getUnconfiguredClientIdsAsString(
      Map<ModuleClient, String> configuredModuleClientSecrets) {
    return Arrays.stream(ModuleClient.values())
        .filter(clientId -> !configuredModuleClientSecrets.containsKey(clientId))
        .map(ModuleClient::getClientId)
        .collect(Collectors.joining(", "));
  }

  private static boolean isClientSecretConfigured(
      Map.Entry<ModuleClient, String> moduleClientConfigEntry) {
    return StringUtils.isNotBlank(moduleClientConfigEntry.getValue());
  }

  private ClientRepresentation buildModuleClient(
      Map.Entry<ModuleClient, String> moduleClientConfigEntry) {
    ModuleClient client = moduleClientConfigEntry.getKey();
    String clientId = client.getClientId();
    String moduleClientSecret = moduleClientConfigEntry.getValue();

    ClientRepresentation clientRepresentation = new ClientRepresentation();
    clientRepresentation.setClientId(clientId);
    clientRepresentation.setName(client.getClientName());
    clientRepresentation.setPublicClient(false);
    clientRepresentation.setSecret(moduleClientSecret);
    clientRepresentation.setStandardFlowEnabled(false);
    clientRepresentation.setDirectAccessGrantsEnabled(true);
    clientRepresentation.setServiceAccountsEnabled(true);
    clientRepresentation.setFrontchannelLogout(false);
    clientRepresentation.setRedirectUris(List.of());
    clientRepresentation.setWebOrigins(List.of());
    clientRepresentation.setAttributes(getClientRepresentationAttributes(Map.of()));
    clientRepresentation.setDefaultClientScopes(List.of(ESHG_CLIENT_SCOPE_NAME));
    clientRepresentation.setOptionalClientScopes(List.of());

    return clientRepresentation;
  }

  private void configureLoginFlow() {
    AuthenticationFlowBuilder builder = new AuthenticationFlowBuilder(CUSTOM_BROWSER_FLOW_ALIAS);
    builder.setDescription("Employee Portal Browser Flow");
    builder.addAlternativeStep("auth-cookie");
    if (this.keycloakProperties.allowPasswordsForEmployees()) {
      builder.addAlternativeStep("auth-username-password-form");
    }
    builder.addAlternativeStep("webauthn-authenticator-passwordless");
    builder.build(this.keycloakClient);
    keycloakClient.bindBrowserFlow(CUSTOM_BROWSER_FLOW_ALIAS);
  }

  private enum SecurityAction {
    WEBAUTHN_REGISTER_PASSWORDLESS(
        "webauthn-register-passwordless", "Webauthn Register Passwordless", true, true),
    UPDATE_PASSWORD("Update Password", false, false),
    CONFIGURE_TOTP("Configure OTP", false, false),
    TERMS_AND_CONDITIONS("Terms and Conditions", false, false),
    UPDATE_PROFILE("Update Profile", false, false),
    VERIFY_EMAIL("Verify Email", true, false),
    VERIFY_PROFILE("Verify Profile", false, false),
    DELETE_ACCOUNT("delete_account", "Delete Account", false, false),
    UPDATE_USER_LOCALE("update_user_locale", "Update User Locale", true, false),
    WEBAUTHN_REGISTER("webauthn-register", "Webauthn Register", false, false),
    DELETE_CREDENTIAL("delete_credential", "Delete Credential", true, false),
    ;

    private final String providerId;
    private final String name;
    private final boolean isEnabled;
    private final boolean isDefault;

    SecurityAction(String name, boolean isEnabled, boolean isDefault) {
      this.providerId = name();
      this.name = name;
      this.isEnabled = isEnabled;
      this.isDefault = isEnabled && isDefault;
    }

    SecurityAction(String providerId, String name, boolean isEnabled, boolean isDefault) {
      this.providerId = providerId;
      this.name = name;
      this.isEnabled = isEnabled;
      this.isDefault = isEnabled && isDefault;
    }

    public boolean isEnabled() {
      return isEnabled;
    }

    public boolean isDefault() {
      return isDefault;
    }

    public String getProviderId() {
      return providerId;
    }

    public String getDisplayName() {
      return name;
    }

    public int getPriority() {
      return 10 * ordinal() + 10;
    }

    public RequiredActionProviderRepresentation representation() {
      RequiredActionProviderRepresentation representation =
          new RequiredActionProviderRepresentation();
      representation.setPriority(getPriority());
      representation.setAlias(getProviderId());
      representation.setProviderId(getProviderId());
      representation.setName(getDisplayName());
      representation.setEnabled(isEnabled());
      representation.setDefaultAction(isDefault());
      return representation;
    }
  }
}
