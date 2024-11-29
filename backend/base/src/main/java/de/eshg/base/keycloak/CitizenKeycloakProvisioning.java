/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.CitizenKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.ACCOUNT_CLIENT_ID;
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
import org.apache.commons.lang3.StringUtils;
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
  public static final String BUND_ID_IDENTITY_PROVIDER_ALIAS = "bund-id";

  static final String PORTAL_BROWSER_FLOW_ALIAS = "portal browser";
  public static final String SYNC_MODE = "syncMode";
  public static final String NAMEID_FORMAT_PERSISTENT =
      "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
  public static final String NAMEID_FORMAT_TRANSIENT =
      "urn:oasis:names:tc:SAML:2.0:nameid-format:transient";
  public static final BundIdAttribute BUND_ID_PRIMARY_KEY_ATTRIBUTE = BundIdAttribute.B_PK_2;

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

    createOrUpdateCitizenPortalAuthenticationFlow();
    createOrUpdateIdentityProviders();
    CitizenPermissionRole[] permissionRoles = CitizenPermissionRole.values();
    createOrUpdateRoles(permissionRoles);
    createOrUpdateEshgClientScope(permissionRoles);
    disableDefaultClients();
    keycloakClient.createOrUpdateClients(List.of(buildEshgAuthServiceClient()));
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
            ACCOUNT_CLIENT_ID,
            ADMIN_CLI_CLIENT_ID,
            BROKER_CLIENT_ID,
            SECURITY_ADMIN_CONSOLE_CLIENT_ID,
            REALM_MANAGEMENT_CLIENT_ID));
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

  private void createOrUpdateIdentityProviders() {
    List<IdentityProviderRepresentation> identityProviders = new ArrayList<>();
    List<IdentityProviderMapperRepresentation> identityProviderMappers = new ArrayList<>();

    KeycloakProperties.IdentityProvider mukIdp = keycloakProperties.citizenRealm().mukIdp();
    if (mukIdp.enabled()) {
      identityProviders.add(
          getSAMLIdentityProvider(
              MUK_IDENTITY_PROVIDER_ALIAS,
              "Mein Unternehmenskonto",
              mukIdp,
              new NameIdPolicy(NAMEID_FORMAT_PERSISTENT, "Subject NameID", null)));
      identityProviderMappers.add(
          getSAMLIdentityProviderRoleMapper(
              MUK_IDENTITY_PROVIDER_ALIAS, CitizenPermissionRole.MUK_USER));
    }

    KeycloakProperties.IdentityProvider bundIdIdp = keycloakProperties.citizenRealm().bundIdIdp();
    if (bundIdIdp.enabled()) {
      identityProviders.add(
          getSAMLIdentityProvider(
              BUND_ID_IDENTITY_PROVIDER_ALIAS,
              "BundID",
              bundIdIdp,
              new NameIdPolicy(
                  NAMEID_FORMAT_TRANSIENT, "ATTRIBUTE", BUND_ID_PRIMARY_KEY_ATTRIBUTE.getOid())));
      identityProviderMappers.add(
          getSAMLIdentityProviderRoleMapper(
              BUND_ID_IDENTITY_PROVIDER_ALIAS, CitizenPermissionRole.BUND_ID_USER));
      identityProviderMappers.add(
          getSAMLIdentityProviderBundIdAttributeMapper(BundIdAttribute.B_PK_2));
    }

    keycloakClient.createOrUpdateIdentityProviders(identityProviders);
    keycloakClient.createOrUpdateIdentityProviderMappers(identityProviderMappers);
  }

  private IdentityProviderMapperRepresentation getSAMLIdentityProviderBundIdAttributeMapper(
      BundIdAttribute attribute) {
    IdentityProviderMapperRepresentation mapper = new IdentityProviderMapperRepresentation();
    mapper.setIdentityProviderAlias(CitizenKeycloakProvisioning.BUND_ID_IDENTITY_PROVIDER_ALIAS);
    mapper.setName("Set BundID attribute %s".formatted(attribute.getFriendlyName()));
    mapper.setIdentityProviderMapper("saml-bundid-session-attribute-idp-mapper");
    mapper.setConfig(
        Map.of(
            SYNC_MODE,
            "INHERIT",
            "attribute.name.format",
            "ATTRIBUTE_FORMAT_URI",
            "attribute.friendly.name",
            attribute.getFriendlyName(),
            "attribute.oid",
            attribute.getOid(),
            "attribute.required",
            String.valueOf(attribute.isRequired()),
            "session.attribute",
            attribute.getFriendlyName(),
            "session.attribute.excludeFromAutomapper",
            TRUE));
    return mapper;
  }

  enum BundIdAttribute {
    B_PK_2("bPK2", "urn:oid:1.3.6.1.4.1.25484.494450.3", true);

    private final String friendlyName;
    private final String oid;
    private final boolean required;

    BundIdAttribute(String friendlyName, String oid, boolean required) {
      this.friendlyName = friendlyName;
      this.oid = oid;
      this.required = required;
    }

    public String getFriendlyName() {
      return friendlyName;
    }

    public String getOid() {
      return oid;
    }

    public boolean isRequired() {
      return required;
    }
  }

  private static IdentityProviderMapperRepresentation getSAMLIdentityProviderRoleMapper(
      String idpAlias, PermissionRole role) {
    IdentityProviderMapperRepresentation mapper = new IdentityProviderMapperRepresentation();
    mapper.setIdentityProviderAlias(idpAlias);
    mapper.setName("Set default role for %s users".formatted(idpAlias));
    mapper.setIdentityProviderMapper("oidc-hardcoded-role-idp-mapper");
    mapper.setConfig(Map.of(SYNC_MODE, "IMPORT", "role", role.getKeycloakName()));
    return mapper;
  }

  private IdentityProviderRepresentation getSAMLIdentityProvider(
      String idpAlias,
      String idpDisplayName,
      KeycloakProperties.IdentityProvider idpConfig,
      NameIdPolicy nameIdPolicy) {
    IdentityProviderRepresentation identityProvider = new IdentityProviderRepresentation();
    identityProvider.setAlias(idpAlias);
    identityProvider.setDisplayName(idpDisplayName);
    identityProvider.setProviderId("saml");
    identityProvider.setConfig(
        Map.ofEntries(
            entry("allowCreate", TRUE),
            entry(
                "entityId",
                "%s/realms/%s"
                    .formatted(keycloakProperties.url(), keycloakProperties.citizenRealm().name())),
            entry("idpEntityId", idpConfig.entityId()),
            entry("singleSignOnServiceUrl", idpConfig.singleSignOnServiceUrl()),
            entry("singleLogoutServiceUrl", idpConfig.singleLogoutServiceUrl()),
            entry("backchannelSupported", FALSE),
            entry("nameIDPolicyFormat", nameIdPolicy.policyFormat()),
            entry("principalType", nameIdPolicy.principalType()),
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
            entry("signingCertificate", idpConfig.signingCertificate()),
            entry("signatureAlgorithm", idpConfig.signatureAlgorithm()),
            entry("encryptionAlgorithm", idpConfig.encryptionAlgorithm()),
            entry("xmlSigKeyInfoKeyNameTransformer", "KEY_ID"),
            entry("addExtensionsElementWithKeyInfo", FALSE),
            entry(SYNC_MODE, "FORCE")));

    if (StringUtils.isNotBlank(nameIdPolicy.principalAttribute())) {
      Map<String, String> config = new LinkedHashMap<>(identityProvider.getConfig());
      config.put("principalAttribute", nameIdPolicy.principalAttribute());
      identityProvider.setConfig(config);
    }
    return identityProvider;
  }

  private record NameIdPolicy(
      String policyFormat, String principalType, String principalAttribute) {}
}
