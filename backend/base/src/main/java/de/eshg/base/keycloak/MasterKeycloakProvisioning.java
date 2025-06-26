/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.KeycloakProvisioning.configureHttpSecurityHeaders;
import static de.eshg.base.keycloak.KeycloakProvisioning.setAttribute;
import static de.eshg.base.keycloak.MasterKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ACCOUNT_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ADMIN_CLI_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.BROKER_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.assertResponseIs204NoContent;

import com.google.common.annotations.VisibleForTesting;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserProfileResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.*;
import org.keycloak.representations.userprofile.config.UPAttributeRequired;
import org.keycloak.representations.userprofile.config.UPConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component(BEAN_NAME)
@DependsOn(BootstrapKeycloakProvisioning.BEAN_NAME)
public class MasterKeycloakProvisioning implements AutoCloseable {
  public static final String BEAN_NAME = "masterKeycloakProvisioning";

  private static final Logger log = LoggerFactory.getLogger(MasterKeycloakProvisioning.class);
  private final KeycloakProperties keycloakProperties;
  private final BootstrapKeycloakProvisioning bootstrapKeycloakProvisioning;
  private final RealmBoundKeycloakClient keycloakClient;

  private static final String CUSTOM_MASTER_BROWSER_FLOW_ALIAS = "keycloak admin login flow";
  private static final String PASSWORD_POLICY =
      String.join(
          " and ",
          "length(12)",
          "notContainsUsername",
          "upperCase(1)",
          "lowerCase(1)",
          "digits(1)",
          "specialChars(1)",
          "maxAuthAge(0)");

  public MasterKeycloakProvisioning(
      BootstrapKeycloakProvisioning bootstrapKeycloakProvisioning, KeycloakProperties properties) {
    this.bootstrapKeycloakProvisioning = bootstrapKeycloakProvisioning;
    this.keycloakClient = new RealmBoundKeycloakClient(properties, "master");
    this.keycloakProperties = properties;
  }

  private void refreshClientAccessToken() {
    this.keycloakClient.refreshToken();
  }

  @PostConstruct
  void provisionMasterRealm() {
    this.bootstrapKeycloakProvisioning.registerClient(this.keycloakClient);
    refreshClientAccessToken();

    configureRealm();
    refreshClientAccessToken();

    configureRequiredActions();
    configureLoginFlow();
    configureDefaultRealmRoles();
    configureUserProfile();
    configureAdminCliClient();
    disableUnusedClients();

    if (this.keycloakProperties.setupAdmin().enabled()) {
      initializeSetupAdmin(
          keycloakProperties.setupAdmin().username(), keycloakProperties.setupAdmin().email());
    }
    if (!this.keycloakProperties.bootstrapAdmin().enabled()) {
      removeTemporaryAdminUsers();
    }
  }

  @Override
  public void close() {
    this.keycloakClient.close();
  }

  @VisibleForTesting
  public RealmBoundKeycloakClient getKeycloakClient() {
    return keycloakClient;
  }

  private void configureRealm() {
    RealmResource realm = keycloakClient.getRealm();
    RealmRepresentation realmRepresentation = realm.toRepresentation();

    setAttribute(realmRepresentation, "frontendUrl", keycloakProperties.url());
    setAttribute(
        realmRepresentation,
        "adminEventsExpiration",
        String.valueOf(Duration.ofDays(7).toSeconds()));

    realmRepresentation.setAdminEventsEnabled(true);
    realmRepresentation.setEventsEnabled(true);
    realmRepresentation.setBruteForceProtected(true);
    realmRepresentation.setPasswordPolicy(PASSWORD_POLICY);
    realmRepresentation.setWebAuthnPolicyRpEntityName("GA Lotse Keycloak Admin");
    realmRepresentation.setWebAuthnPolicySignatureAlgorithms(
        KeycloakProvisioning.WEBAUTHN_SIGNATURE_ALGORITHMS);
    realmRepresentation.setWebAuthnPolicyUserVerificationRequirement("required");
    realmRepresentation.setSsoSessionIdleTimeout(
        Math.toIntExact(keycloakProperties.adminSessionTimeout().toSeconds()));
    realmRepresentation.setSsoSessionMaxLifespan(
        Math.toIntExact(keycloakProperties.adminSessionLimit().toSeconds()));
    configureHttpSecurityHeaders(log, realmRepresentation);

    KeycloakProperties.Smtp smtp = keycloakProperties.smtp();
    realmRepresentation.setSmtpServer(KeycloakMapper.mapSmtpServer(smtp));

    realm.update(realmRepresentation);
  }

  private void configureDefaultRealmRoles() {
    RealmResource realm = keycloakClient.getRealm();
    RealmRepresentation representation = realm.toRepresentation();
    // TODO(ISSUE-3525): Use more specific roles
    RoleRepresentation adminRole = realm.roles().get("admin").toRepresentation();
    RoleRepresentation defaultRole = representation.getDefaultRole();
    realm.rolesById().addComposites(defaultRole.getId(), List.of(adminRole));
  }

  private void configureRequiredActions() {
    keycloakClient.updateAuthenticationSettings(
        authentication -> {
          Map<String, RequiredActionProviderRepresentation> existingRequiredActions =
              authentication.getRequiredActions().stream()
                  .collect(
                      Collectors.toMap(
                          RequiredActionProviderRepresentation::getProviderId,
                          Function.identity()));
          for (SecurityAction action : SecurityAction.values()) {
            log.info(
                "Updating action {} enabled={} default={}",
                action.name(),
                action.isEnabled(),
                action.isDefault());
            authentication.updateRequiredAction(action.getProviderId(), action.representation());
            existingRequiredActions.remove(action.getProviderId());
          }

          for (RequiredActionProviderRepresentation action : existingRequiredActions.values()) {
            log.info("Disabling action {}", action.getAlias());
            action.setEnabled(false);
            action.setDefaultAction(false);
            action.setPriority(1000);
            authentication.updateRequiredAction(action.getAlias(), action);
          }
        });
  }

  private void configureUserProfile() {
    UserProfileResource profileResource = keycloakClient.getRealm().users().userProfile();

    UPConfig config = profileResource.getConfiguration();
    UPAttributeRequired required = new UPAttributeRequired(Set.of("user", "admin"), Set.of());
    config.getAttribute("email").setRequired(required);
    profileResource.update(config);
  }

  private void configureLoginFlow() {
    AuthenticationFlowBuilder builder =
        new AuthenticationFlowBuilder(CUSTOM_MASTER_BROWSER_FLOW_ALIAS);
    builder.setDescription("Keycloak Admin Browser Flow");
    builder.addAlternativeStep("auth-cookie");
    builder.addSubflow(
        "Admin Login",
        (subflow) -> {
          subflow.addRequiredStep("auth-username-password-form");
          subflow.addConditionalStep("Configured Passkey", "webauthn-authenticator");
        });
    builder.build(this.keycloakClient);
    keycloakClient.bindBrowserFlow(CUSTOM_MASTER_BROWSER_FLOW_ALIAS);
  }

  private void configureAdminCliClient() {
    ClientResource adminCli =
        this.keycloakClient
            .getClientByClientId(ADMIN_CLI_CLIENT_ID)
            .orElseThrow(
                () ->
                    new IllegalStateException(
                        "Could not find client '%s' in master realm"
                            .formatted(ADMIN_CLI_CLIENT_ID)));
    ClientRepresentation representation = adminCli.toRepresentation();
    representation.setEnabled(this.keycloakProperties.bootstrapAdmin().enabled());
    adminCli.update(representation);
  }

  private void disableUnusedClients() {
    this.keycloakClient.disableClients(Set.of(BROKER_CLIENT_ID));

    // Account client has to be enabled to access the account management console,
    // but the standard flow should be disabled.
    this.keycloakClient
        .getClientByClientId(ACCOUNT_CLIENT_ID)
        .ifPresent(
            account -> {
              ClientRepresentation representation = account.toRepresentation();
              if (representation.isStandardFlowEnabled() == Boolean.TRUE) {
                log.info("Disabling standard flow on '{}' client", ACCOUNT_CLIENT_ID);
              }
              representation.setStandardFlowEnabled(false);
              account.update(representation);
            });
  }

  private void removeTemporaryAdminUsers() {
    List<UserRepresentation> temporaryAdmins = this.keycloakClient.getUsersMarkedAsTemporaryAdmin();
    for (UserRepresentation temporaryAdmin : temporaryAdmins) {
      List<String> attributeValues = temporaryAdmin.getAttributes().get("is_temporary_admin");
      if (attributeValues == null || !attributeValues.contains("true")) {
        throw new IllegalStateException(
            "Found unexpected user in attribute query for temporary admin with username '%s'"
                .formatted(temporaryAdmin.getUsername()));
      }

      log.info("Deleting temporary admin with username '{}'", temporaryAdmin.getUsername());
      try (Response response =
          this.keycloakClient.getRealm().users().delete(temporaryAdmin.getId())) {
        assertResponseIs204NoContent(response);
      }
    }
  }

  @VisibleForTesting
  public void initializeSetupAdmin(String username, String emailAddress) {
    RealmResource realm = keycloakClient.getRealm();

    Optional<UserRepresentation> existingUser = keycloakClient.getUserByName(username);

    UserRepresentation userRepresentation =
        existingUser.orElseGet(() -> createSetupAdmin(username, emailAddress));

    UserResource userResource = realm.users().get(userRepresentation.getId());

    if (userResource.credentials().isEmpty()) {
      log.info("Sending credential setup email to {}", emailAddress);
      userResource.executeActionsEmail(
          List.of(
              SecurityAction.UPDATE_PASSWORD.getProviderId(),
              SecurityAction.WEBAUTHN_REGISTER.getProviderId()),
          (int) this.keycloakProperties.setupAdmin().emailLifetime().toSeconds());
    } else {
      log.info(
          "Found setup admin with username {} and {} credentials",
          username,
          userResource.credentials().size());
    }
  }

  private UserRepresentation createSetupAdmin(String username, String emailAddress) {
    log.info("Creating setup admin {} with email {}", username, emailAddress);
    UserRepresentation user = new UserRepresentation();
    user.setUsername(username);
    // TODO: Configure this for an external email later
    user.setEmail(emailAddress);
    user.setEnabled(true);

    UserResource resource = keycloakClient.createUser(user);
    resource.disableCredentialType(
        List.of(
            CredentialRepresentation.HOTP,
            CredentialRepresentation.TOTP,
            CredentialRepresentation.KERBEROS));
    return resource.toRepresentation();
  }

  private enum SecurityAction {
    UPDATE_PASSWORD("Update Password", true, true),
    WEBAUTHN_REGISTER("webauthn-register", "Webauthn Register", true, true),
    UPDATE_PROFILE("Update Profile", true, true),
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
