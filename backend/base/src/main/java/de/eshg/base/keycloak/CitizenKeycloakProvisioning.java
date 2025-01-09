/*
 * Copyright 2025 cronn GmbH
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
import java.util.stream.Stream;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.representations.idm.ClientRepresentation;
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
  public static final String ATTRIBUTE_NAME_FORMAT = "attribute.name.format";
  public static final String INHERIT = "INHERIT";
  public static final String BUND_ID_ACR_HIGH = "STORK-QAA-Level-4";
  public static final String ACR_LOA_SINGLE_MAPPING_TEMPLATE = "{\"%s\":\"%s\"}";

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
    createOrUpdateClients();
    createOrUpdateDefaultRoleComposites();
    configureUserProfile(CitizenUserAttribute.values());
  }

  private void createOrUpdateClients() {
    ClientRepresentation authServiceClient = buildEshgAuthServiceClient();
    authServiceClient
        .getAttributes()
        .put("acr.loa.map", ACR_LOA_SINGLE_MAPPING_TEMPLATE.formatted(BUND_ID_ACR_HIGH, 4));
    authServiceClient.getAttributes().put("default.acr.values", BUND_ID_ACR_HIGH);
    keycloakClient.createOrUpdateClients(List.of(authServiceClient));
  }

  @Override
  protected void configureRealm(RealmRepresentation realmRepresentation) {
    super.configureRealm(realmRepresentation);
    this.configureBruteForceProtection(realmRepresentation);
    this.configureDefaultPasswordPolicies(realmRepresentation);
  }

  private void configureBruteForceProtection(RealmRepresentation realm) {
    realm.setFailureFactor(MAX_LOGIN_FAILURES);
    int lockoutSeconds = Math.toIntExact(TimeUnit.HOURS.toSeconds(BRUTE_FORCE_LOCKOUT_HOURS));
    realm.setMaxDeltaTimeSeconds(lockoutSeconds);
    realm.setWaitIncrementSeconds(lockoutSeconds);
    realm.setMaxFailureWaitSeconds(lockoutSeconds);
  }

  private void configureDefaultPasswordPolicies(RealmRepresentation realmRepresentation) {
    realmRepresentation.setPasswordPolicy(null);
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
      identityProviderMappers.addAll(getMukIdentityProviderMappers());
    }

    KeycloakProperties.IdentityProvider bundIdIdp = keycloakProperties.citizenRealm().bundIdIdp();
    if (bundIdIdp.enabled()) {
      identityProviders.add(
          getSAMLIdentityProvider(
              BUND_ID_IDENTITY_PROVIDER_ALIAS,
              "BundID",
              bundIdIdp,
              new NameIdPolicy(
                  NAMEID_FORMAT_TRANSIENT, "ATTRIBUTE", BundIdUserAttribute.B_PK_2.getSamlName())));
      identityProviderMappers.addAll(getBundIdIdentityProviderMappers());
    }

    keycloakClient.createOrUpdateIdentityProviders(identityProviders);
    keycloakClient.createOrUpdateIdentityProviderMappers(identityProviderMappers);
  }

  private static List<IdentityProviderMapperRepresentation> getMukIdentityProviderMappers() {
    return ListUtils.union(
        List.of(
            getSAMLIdentityProviderRoleMapper(
                MUK_IDENTITY_PROVIDER_ALIAS, CitizenPermissionRole.MUK_USER)),
        Arrays.stream(MukUserAttribute.values())
            .map(
                attribute ->
                    getSAMLIdentityProviderAttributeMapper(MUK_IDENTITY_PROVIDER_ALIAS, attribute))
            .toList());
  }

  private static List<IdentityProviderMapperRepresentation> getBundIdIdentityProviderMappers() {
    return ListUtils.union(
        List.of(
            getSAMLIdentityProviderRoleMapper(
                BUND_ID_IDENTITY_PROVIDER_ALIAS, CitizenPermissionRole.BUND_ID_USER)),
        Arrays.stream(BundIdUserAttribute.values())
            .flatMap(
                attribute ->
                    Stream.of(
                        getSAMLIdentityProviderBundIdAuthnRequestMapper(attribute),
                        getSAMLIdentityProviderAttributeMapper(
                            BUND_ID_IDENTITY_PROVIDER_ALIAS, attribute)))
            .toList());
  }

  private static IdentityProviderMapperRepresentation
      getSAMLIdentityProviderBundIdAuthnRequestMapper(BundIdUserAttribute attribute) {
    IdentityProviderMapperRepresentation mapper = new IdentityProviderMapperRepresentation();
    mapper.setIdentityProviderAlias(BUND_ID_IDENTITY_PROVIDER_ALIAS);
    mapper.setName(
        "Set requested attribute %s in %s AuthnRequests"
            .formatted(attribute.getFriendlyName(), BUND_ID_IDENTITY_PROVIDER_ALIAS));
    mapper.setIdentityProviderMapper("saml-bundid-session-attribute-idp-mapper");
    mapper.setConfig(
        Map.of(
            SYNC_MODE,
            INHERIT,
            ATTRIBUTE_NAME_FORMAT,
            "ATTRIBUTE_FORMAT_URI",
            "attribute.friendly.name",
            attribute.getFriendlyName(),
            "attribute.oid",
            attribute.getSamlName(),
            "attribute.required",
            String.valueOf(attribute.isRequired()),
            "session.attribute",
            attribute.getCitizenUserAttribute().getKey(),
            "session.attribute.excludeFromAutomapper",
            TRUE));
    return mapper;
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

  private static IdentityProviderMapperRepresentation getSAMLIdentityProviderAttributeMapper(
      String idpAlias, IdpUserAttribute attribute) {
    IdentityProviderMapperRepresentation mapper = new IdentityProviderMapperRepresentation();
    mapper.setIdentityProviderAlias(idpAlias);
    mapper.setName(
        "Set attribute %s for %s users"
            .formatted(attribute.getCitizenUserAttribute().getDisplayName(), idpAlias));
    Map<String, String> config = getSamlAttributeMapperConfig(attribute);
    if (attribute instanceof MukUserAttribute mukUserAttribute
        && StringUtils.isNotBlank(mukUserAttribute.getXPath())) {
      mapper.setIdentityProviderMapper("saml-xpath-attribute-idp-mapper");
      config.put("attribute.xpath", mukUserAttribute.getXPath());
    } else {
      mapper.setIdentityProviderMapper("saml-user-attribute-idp-mapper");
    }
    mapper.setConfig(config);
    return mapper;
  }

  private static Map<String, String> getSamlAttributeMapperConfig(IdpUserAttribute attribute) {
    return new LinkedHashMap<>(
        Map.of(
            SYNC_MODE,
            INHERIT,
            ATTRIBUTE_NAME_FORMAT,
            attribute.getAttributeNameFormat().getIdpMapperName(),
            "attribute.name",
            attribute.getSamlName(),
            "user.attribute",
            attribute.getCitizenUserAttribute().getKey()));
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
