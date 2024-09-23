/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.CitizenKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ACCOUNT_CONSOLE_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ADMIN_CLI_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.BROKER_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.REALM_MANAGEMENT_CLIENT_ID;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SECURITY_ADMIN_CONSOLE_CLIENT_ID;
import static java.util.Map.entry;

import de.eshg.lib.keycloak.*;
import de.eshg.mutex.MutexService;
import java.net.URI;
import java.util.*;
import java.util.concurrent.TimeUnit;
import org.keycloak.representations.idm.IdentityProviderMapperRepresentation;
import org.keycloak.representations.idm.IdentityProviderRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The purpose of this component is to encapsulate ESHG-specific logic for provisioning Keycloak.
 */
@Component(BEAN_NAME)
public class CitizenKeycloakProvisioning extends KeycloakProvisioning<CitizenKeycloakClient> {
  public static final int MAX_LOGIN_FAILURES = 5;
  public static final int BRUTE_FORCE_LOCKOUT_HOURS = 6;

  public static final String BEAN_NAME = "citizenKeycloakProvisioning";
  public static final String MUK_IDENTITY_PROVIDER_ALIAS = "muk";

  static final String PORTAL_BROWSER_FLOW_ALIAS = "portal browser";
  public static final String SYNC_MODE = "syncMode";

  public CitizenKeycloakProvisioning(
      CitizenKeycloakClient citizenKeycloakClient,
      KeycloakProperties keycloakProperties,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") URI reverseProxyUrl,
      MutexService mutexService) {
    super(
        citizenKeycloakClient,
        keycloakProperties,
        reverseProxyUrl,
        keycloakProperties.citizenRealm(),
        mutexService);
  }

  @Override
  void provisionRealmInternal() {
    createOrUpdateRealm();
    createOrUpdateEshgClientScope();

    disableDefaultClients();
    keycloakClient.createOrUpdateClients(List.of(buildEshgAuthServiceClient()));
    createOrUpdateCitizenPortalAuthenticationFlow();
    createOrUpdateMukIdentityProvider();
    createOrUpdateRoles();
    createOrUpdateDefaultRoleComposites();
    configureUserProfile(CitizenUserAttribute.values());
  }

  @Override
  protected void configureRealm(RealmRepresentation realmRepresentation) {
    super.configureRealm(realmRepresentation);
    this.configureBruteForceProtection(realmRepresentation);
  }

  private void configureBruteForceProtection(RealmRepresentation realm) {
    realm.setFailureFactor(MAX_LOGIN_FAILURES);
    int lockoutSeconds = Math.toIntExact(TimeUnit.HOURS.toSeconds(BRUTE_FORCE_LOCKOUT_HOURS));
    realm.setMaxDeltaTimeSeconds(lockoutSeconds);
    realm.setWaitIncrementSeconds(lockoutSeconds);
    realm.setMaxFailureWaitSeconds(lockoutSeconds);
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

  private void createOrUpdateRoles() {
    keycloakClient.createOrUpdateRoles(
        List.of(CitizenPermissionRole.values()), this::configureRole);
  }

  private void createOrUpdateDefaultRoleComposites() {
    keycloakClient.createOrUpdateDefaultRoleComposites(
        List.of(CitizenPermissionRole.STANDARD_CITIZEN));
  }

  private void createOrUpdateCitizenPortalAuthenticationFlow() {
    AuthenticationFlowBuilder builder = new AuthenticationFlowBuilder(PORTAL_BROWSER_FLOW_ALIAS);
    builder.setDescription("Citizen Portal Browser Flow");
    builder.addAlternativeStep("auth-cookie");
    builder.addAlternativeStep("identity-provider-redirector");
    builder.addAlternativeStep("access-code");
    builder.build(keycloakClient);

    keycloakClient.bindBrowserFlow(PORTAL_BROWSER_FLOW_ALIAS);
  }

  private void createOrUpdateMukIdentityProvider() {
    List<IdentityProviderRepresentation> identityProviders = new ArrayList<>();
    List<IdentityProviderMapperRepresentation> identityProviderMappers = new ArrayList<>();
    if (keycloakProperties.citizenRealm().mukIdp().enabled()) {
      identityProviders.add(getMukIdentityProvider());
      identityProviderMappers.add(getMukIdentityProviderMapper());
    }
    keycloakClient.createOrUpdateIdentityProviders(identityProviders);
    keycloakClient.createOrUpdateIdentityProviderMappers(identityProviderMappers);
  }

  private static IdentityProviderMapperRepresentation getMukIdentityProviderMapper() {
    IdentityProviderMapperRepresentation mapper = new IdentityProviderMapperRepresentation();
    mapper.setIdentityProviderAlias(MUK_IDENTITY_PROVIDER_ALIAS);
    mapper.setName("Set default role for MUK users");
    mapper.setIdentityProviderMapper("oidc-hardcoded-role-idp-mapper");
    mapper.setConfig(
        Map.of(SYNC_MODE, "IMPORT", "role", CitizenPermissionRole.MUK_USER.getKeycloakName()));
    return mapper;
  }

  private IdentityProviderRepresentation getMukIdentityProvider() {
    IdentityProviderRepresentation identityProvider = new IdentityProviderRepresentation();
    identityProvider.setAlias(MUK_IDENTITY_PROVIDER_ALIAS);
    identityProvider.setDisplayName("Mein Unternehmenskonto");
    identityProvider.setProviderId("saml");
    KeycloakProperties.IdentityProvider mukIdp = keycloakProperties.citizenRealm().mukIdp();
    identityProvider.setConfig(
        Map.ofEntries(
            entry("allowCreate", TRUE),
            entry(
                "entityId",
                "%s/realms/%s"
                    .formatted(keycloakProperties.url(), keycloakProperties.citizenRealm().name())),
            entry("idpEntityId", mukIdp.entityId()),
            entry("singleSignOnServiceUrl", mukIdp.singleSignOnServiceUrl()),
            entry("singleLogoutServiceUrl", mukIdp.singleLogoutServiceUrl()),
            entry("backchannelSupported", FALSE),
            entry("nameIDPolicyFormat", "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"),
            entry("principalType", "Subject NameID"),
            entry("postBindingResponse", TRUE),
            entry("postBindingAuthnRequest", TRUE),
            entry("postBindingLogout", TRUE),
            entry("wantAuthnRequestsSigned", TRUE),
            entry("wantAssertionsSigned", FALSE),
            entry("wantAssertionsEncrypted", TRUE),
            entry("forceAuthn", FALSE),
            entry("validateSignature", TRUE),
            entry("signSpMetadata", TRUE),
            entry("loginHint", FALSE),
            entry("allowedClockSkew", String.valueOf(0)),
            entry("attributeConsumingServiceIndex", String.valueOf(0)),
            entry("signingCertificate", mukIdp.signingCertificate()),
            entry("signatureAlgorithm", mukIdp.signatureAlgorithm()),
            entry("encryptionAlgorithm", mukIdp.encryptionAlgorithm()),
            entry("xmlSigKeyInfoKeyNameTransformer", "KEY_ID"),
            entry("addExtensionsElementWithKeyInfo", FALSE),
            entry(SYNC_MODE, "FORCE")));
    return identityProvider;
  }
}
