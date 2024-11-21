/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.CitizenKeycloakProvisioning.BPK2_ATTRIBUTE;
import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;
import static de.eshg.base.keycloak.KeycloakProvisioning.TRUE;

import de.eshg.base.keycloak.differ.ComponentRepresentationDiffer;
import de.eshg.lib.keycloak.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import jakarta.ws.rs.core.Response;
import java.util.*;
import java.util.function.Consumer;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.representations.idm.*;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component
@DependsOn(CitizenKeycloakProvisioning.BEAN_NAME)
@ConditionalOnTestUserProvisioningEnabled
public class CitizenKeycloakTestProvisioning extends KeycloakTestProvisioning
    implements AutoCloseable {
  public static final String MUK_TEST_REALM_NAME = "muk-test";
  public static final String BUND_ID_TEST_REALM_NAME = "bund-id-test";
  private static final String KEY_PROVIDER_TYPE = "org.keycloak.keys.KeyProvider";
  private static final String KEY_PRIORITY = "100";
  private static final String SAML = "saml";
  private static final String SAML_ATTRIBUTES = "saml-attributes";

  private final CitizenKeycloakClient citizenKeycloakClient;
  private final RealmBoundKeycloakClient mukKeycloakClient;
  private final RealmBoundKeycloakClient bundIdKeycloakClient;

  public CitizenKeycloakTestProvisioning(
      CitizenKeycloakTestClient citizenKeycloakTestClient,
      CitizenKeycloakClient citizenKeycloakClient,
      KeycloakProperties keycloakProperties,
      EnvironmentConfig environmentConfig) {
    super(citizenKeycloakTestClient, keycloakProperties, environmentConfig);
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.mukKeycloakClient = new RealmBoundKeycloakClient(keycloakProperties, MUK_TEST_REALM_NAME);
    this.bundIdKeycloakClient =
        new RealmBoundKeycloakClient(keycloakProperties, BUND_ID_TEST_REALM_NAME);
  }

  @Override
  void provisionTestResources() {
    super.provisionTestResources();

    if (keycloakProperties.mukTestRealm().enabled()) {
      log.warn("Adding a muk realm for development");
      createOrUpdateIdpTestRealm(mukKeycloakClient, this::getMukTestRealmRepresentation);
      createOrUpdateIdpTestRealmKeys(
          keycloakProperties.mukTestRealm(),
          keycloakProperties.citizenRealm().mukIdp(),
          mukKeycloakClient);
      createOrUpdateSamlClientInIdpTestRealm(
          CitizenKeycloakProvisioning.MUK_IDENTITY_PROVIDER_ALIAS, mukKeycloakClient);
      addTestUserToMukRealm();
    }

    if (keycloakProperties.bundIdTestRealm().enabled()) {
      log.warn("Adding a bund-id realm for development");
      createOrUpdateIdpTestRealm(bundIdKeycloakClient, this::getBundIdTestRealmRepresentation);
      createOrUpdateIdpTestRealmKeys(
          keycloakProperties.bundIdTestRealm(),
          keycloakProperties.citizenRealm().bundIdIdp(),
          bundIdKeycloakClient);
      createOrUpdateBundIdTestClientScope();
      createOrUpdateSamlClientInIdpTestRealm(
          CitizenKeycloakProvisioning.BUND_ID_IDENTITY_PROVIDER_ALIAS, bundIdKeycloakClient);
      addTestUserToBundIdRealm();
    }
  }

  @Override
  public void close() {
    this.mukKeycloakClient.close();
    this.bundIdKeycloakClient.close();
  }

  private void createOrUpdateIdpTestRealmKeys(
      KeycloakProperties.IdpTestRealm idpTestRealm,
      KeycloakProperties.IdentityProvider idpConfig,
      RealmBoundKeycloakClient idpTestRealmClient) {
    ComponentRepresentationDiffer keysDiffer =
        new ComponentRepresentationDiffer(
            getExistingKeys(idpTestRealmClient),
            List.of(getSignatureKeyProvider(idpTestRealm, idpConfig)));
    keysDiffer.getElementsToDelete().forEach(key -> deleteIdpTestRealmKey(idpTestRealmClient, key));
    keysDiffer.getElementsToAdd().forEach(key -> addIdpTestRealmKey(idpTestRealmClient, key));
    keysDiffer
        .getElementsToUpdate()
        .forEach(update -> updateIdpTestRealmKey(idpTestRealmClient, update));
  }

  private void deleteIdpTestRealmKey(
      RealmBoundKeycloakClient idpTestRealmClient, ComponentRepresentation representation) {
    log.info(
        "Removing key provider '{}' from {} realm",
        representation.getName(),
        idpTestRealmClient.realmName);
    idpTestRealmClient.getRealm().components().component(representation.getId()).remove();
  }

  private void addIdpTestRealmKey(
      RealmBoundKeycloakClient idpTestRealmClient, ComponentRepresentation representation) {
    log.info(
        "Adding key provider '{}' to {} realm",
        representation.getName(),
        idpTestRealmClient.realmName);
    try (Response response = idpTestRealmClient.getRealm().components().add(representation)) {
      RealmBoundKeycloakClient.assertResponseIs201Created(response);
    }
  }

  private void updateIdpTestRealmKey(
      RealmBoundKeycloakClient idpTestRealmClient, ToUpdate<ComponentRepresentation> update) {
    ComponentRepresentation keyProvider = update.newState();
    log.info(
        "Key provider '{}' already exists in {} realm, but update is required: {}",
        keyProvider.getName(),
        idpTestRealmClient.realmName,
        update.multiLineDiff());
    idpTestRealmClient.getRealm().components().component(keyProvider.getId()).update(keyProvider);
  }

  private ComponentRepresentation getSignatureKeyProvider(
      KeycloakProperties.IdpTestRealm idpTestRealm, KeycloakProperties.IdentityProvider idpConfig) {
    ComponentRepresentation keyProvider = new ComponentRepresentation();
    keyProvider.setName("test-rsa-signature");
    keyProvider.setProviderId("rsa");
    keyProvider.setProviderType(KEY_PROVIDER_TYPE);
    keyProvider.setConfig(
        new MultivaluedHashMap<>(
            Map.of(
                "privateKey", List.of(idpTestRealm.signatureKey()),
                "certificate", List.of(idpConfig.signingCertificate()),
                "priority", List.of(KEY_PRIORITY),
                "active", List.of(TRUE),
                "enabled", List.of(TRUE),
                "algorithm", List.of("RS256"))));
    return keyProvider;
  }

  private List<ComponentRepresentation> getExistingKeys(
      RealmBoundKeycloakClient idpTestRealmClient) {
    return idpTestRealmClient.getRealm().components().query(null, KEY_PROVIDER_TYPE).stream()
        .sorted(Comparator.comparing(ComponentRepresentation::getName))
        .toList();
  }

  private void addTestUserToMukRealm() {
    addTestUsersToIdpTestRealm(mukKeycloakClient, List.of(IdpTestUser.MUK_DUMMY));
  }

  private void addTestUserToBundIdRealm() {
    addTestUsersToIdpTestRealm(bundIdKeycloakClient, List.of(IdpTestUser.BUND_ID_DUMMY));
  }

  private void addTestUsersToIdpTestRealm(
      RealmBoundKeycloakClient realmClient, List<KeycloakUser> users) {
    new KeycloakTestClient(realmClient, keycloakProperties, 16, environmentConfig)
        .createOrUpdateUsers(users, this::configureMukUser);
  }

  private void configureMukUser(UserRepresentation userRepresentation, KeycloakUser user) {
    userRepresentation.setUsername(user.username());
    userRepresentation.setEmail(user.email());
    userRepresentation.setEmailVerified(true);
    userRepresentation.setEnabled(true);
    userRepresentation.setRequiredActions(List.of());
    userRepresentation.setAttributes(null);
  }

  private void createOrUpdateIdpTestRealm(
      RealmBoundKeycloakClient idpTestRealmClient,
      Consumer<RealmRepresentation> idpTestRealmRepresentation) {
    String idpTestRealmName = idpTestRealmClient.realmName;
    idpTestRealmClient.createOrUpdateRealm(idpTestRealmRepresentation);
    idpTestRealmClient.configureUserProfile(
        IdpTestUserAttribute.values(), idpTestRealmName, idpTestRealmName);
  }

  private void getMukTestRealmRepresentation(RealmRepresentation realmRepresentation) {
    realmRepresentation.setRealm(MUK_TEST_REALM_NAME);
    realmRepresentation.setDisplayName("MUK (Dev)");
    realmRepresentation.setDisplayNameHtml("MUK (Dev)");
    realmRepresentation.setEnabled(true);
  }

  private void getBundIdTestRealmRepresentation(RealmRepresentation realmRepresentation) {
    realmRepresentation.setRealm(BUND_ID_TEST_REALM_NAME);
    realmRepresentation.setDisplayName("BundID (Dev)");
    realmRepresentation.setDisplayNameHtml("BundID (Dev)");
    realmRepresentation.setEnabled(true);
  }

  private void createOrUpdateSamlClientInIdpTestRealm(
      String idpAlias, RealmBoundKeycloakClient idpTestRealmClient) {
    String brokerEndpoint =
        "%s/realms/%s/broker/%s/endpoint"
            .formatted(
                keycloakProperties.url(), keycloakProperties.citizenRealm().name(), idpAlias);
    List<KeysMetadataRepresentation.KeyMetadataRepresentation> keys =
        citizenKeycloakClient.getRealm().keys().getKeyMetadata().getKeys();

    ClientRepresentation client = new ClientRepresentation();
    // The clientId must match the issuer of the SAML AuthnRequest
    String clientId =
        "%s/realms/%s"
            .formatted(keycloakProperties.url(), keycloakProperties.citizenRealm().name());
    client.setClientId(clientId);
    client.setProtocol("saml");
    client.setPublicClient(true);
    client.setFullScopeAllowed(true);
    client.setRedirectUris(List.of(brokerEndpoint));
    client.setWebOrigins(List.of("+"));
    client.setFrontchannelLogout(false);
    client.setDefaultClientScopes(List.of("role_list", SAML_ATTRIBUTES));
    client.setOptionalClientScopes(List.of());
    Map<String, String> attributes =
        new TreeMap<>(
            Map.ofEntries(
                new AbstractMap.SimpleEntry<>("saml.assertion.signature", TRUE),
                new AbstractMap.SimpleEntry<>(
                    "saml.signing.certificate", getSigningCertificate(keys)),
                new AbstractMap.SimpleEntry<>("saml.signature.algorithm", "RSA_SHA256"),
                new AbstractMap.SimpleEntry<>(
                    "saml_single_logout_service_url_post", brokerEndpoint),
                new AbstractMap.SimpleEntry<>("saml.encrypt", TRUE),
                new AbstractMap.SimpleEntry<>("saml.client.signature", TRUE),
                new AbstractMap.SimpleEntry<>(
                    "saml.encryption.certificate", getEncryptionCertificate(keys)),
                new AbstractMap.SimpleEntry<>("saml.authnstatement", TRUE),
                new AbstractMap.SimpleEntry<>("saml_assertion_consumer_url_post", brokerEndpoint),
                new AbstractMap.SimpleEntry<>("saml_name_id_format", "persistent"),
                new AbstractMap.SimpleEntry<>("saml.server.signature", TRUE),
                new AbstractMap.SimpleEntry<>("saml.server.signature.keyinfo.ext", FALSE)));
    idpTestRealmClient
        .getClientByClientId(clientId)
        .ifPresent(existingClient -> setDefaultValuesForDiff(existingClient, attributes));
    client.setAttributes(attributes);
    idpTestRealmClient.createOrUpdateClients(
        List.of(client),
        // Workaround since we cannot use the usual "system-" prefix here
        // The muk-test realm is a separate realm, where we only need exactly this one
        c -> true);
  }

  private void setDefaultValuesForDiff(
      ClientResource existingClient, Map<String, String> attributes) {
    Map<String, String> existingAttributes = existingClient.toRepresentation().getAttributes();
    attributes.put(
        "client.secret.creation.time", existingAttributes.get("client.secret.creation.time"));
    attributes.put("saml.allow.ecp.flow", existingAttributes.get("saml.allow.ecp.flow"));
    attributes.put(
        "saml.artifact.binding.identifier",
        existingAttributes.get("saml.artifact.binding.identifier"));
    attributes.put("saml.force.post.binding", existingAttributes.get("saml.force.post.binding"));
    attributes.put(
        "saml_force_name_id_format", existingAttributes.get("saml_force_name_id_format"));
    attributes.put(
        "saml_signature_canonicalization_method",
        existingAttributes.get("saml_signature_canonicalization_method"));
  }

  private static String getEncryptionCertificate(
      List<KeysMetadataRepresentation.KeyMetadataRepresentation> keys) {
    return getRealmKeyCertificate(keys, "enc", "RSA-OAEP");
  }

  private static String getSigningCertificate(
      List<KeysMetadataRepresentation.KeyMetadataRepresentation> keys) {
    return getRealmKeyCertificate(keys, "sig", "RS256");
  }

  private static String getRealmKeyCertificate(
      List<KeysMetadataRepresentation.KeyMetadataRepresentation> keys,
      String keyUseSpecName,
      String keyAlgorithm) {
    return keys.stream()
        .filter(key -> key.getStatus().equals("ACTIVE"))
        .filter(key -> key.getType().equals("RSA"))
        .filter(key -> key.getAlgorithm().equals(keyAlgorithm))
        .filter(key -> key.getUse().getSpecName().equals(keyUseSpecName))
        .map(KeysMetadataRepresentation.KeyMetadataRepresentation::getCertificate)
        .findFirst()
        .orElseThrow(
            () ->
                new RuntimeException(
                    "No certificate found with algorithm '%s' and spec name '%s'"
                        .formatted(keyAlgorithm, keyUseSpecName)));
  }

  @Override
  protected List<KeycloakUser> getAllKeycloakUsersToProvision() {
    List<KeycloakUser> allUsers = new ArrayList<>();
    allUsers.addAll(List.of(CitizenTestUser.values()));
    allUsers.addAll(getPermissionRoleUsers(CitizenPermissionRole.values()));
    return allUsers;
  }

  private enum IdpTestUserAttribute implements KeycloakUserAttribute {
    EMAIL(DEFAULT_ATTRIBUTE_EMAIL, KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_EMAIL)),
    FIRST_NAME(
        DEFAULT_ATTRIBUTE_FIRST_NAME,
        KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_FIRST_NAME)),
    LAST_NAME(
        DEFAULT_ATTRIBUTE_LAST_NAME,
        KEYCLOAK_VALUE_REF_TEMPLATE.formatted(DEFAULT_ATTRIBUTE_LAST_NAME)),
    ;

    private final String key;
    private final String displayName;

    IdpTestUserAttribute(String key, String displayName) {
      this.key = key;
      this.displayName = displayName;
    }

    @Override
    public String getKey() {
      return key;
    }

    @Override
    public String getDisplayName() {
      return displayName;
    }

    @Override
    public Group getGroup() {
      return Group.DEFAULT;
    }

    @Override
    public boolean isRequired() {
      return false;
    }

    @Override
    public List<ValidationRule> validationRules() {
      return List.of();
    }
  }

  private enum IdpTestUser implements KeycloakUser {
    MUK_DUMMY("muk-dummy", "password"),
    BUND_ID_DUMMY("bund-id-dummy", "password"),
    ;

    private final String username;
    private final String password;

    IdpTestUser(String username, String password) {
      this.username = username;
      this.password = password;
    }

    @Override
    public String username() {
      return username;
    }

    @Override
    public String email() {
      return username + KeycloakUser.TEST_USER_EMAIL_POSTFIX;
    }

    @Override
    public String phoneNumber() {
      return null;
    }

    @Override
    public String externalChatUsername() {
      return null;
    }

    @Override
    public String firstName() {
      return null;
    }

    @Override
    public String lastName() {
      return null;
    }

    @Override
    public String password() {
      return password;
    }

    @Override
    public List<KeycloakRole> roles() {
      return List.of();
    }

    @Override
    public List<KeycloakGroup> groups() {
      return List.of();
    }
  }

  protected void createOrUpdateBundIdTestClientScope() {
    ClientScopeRepresentation clientScope = new ClientScopeRepresentation();
    clientScope.setName(SAML_ATTRIBUTES);
    clientScope.setDescription("Sets bund-id SAML attributes");
    clientScope.setProtocol(SAML);
    clientScope.setAttributes(Map.of("include.in.token.scope", FALSE));
    clientScope.setProtocolMappers(List.of(getHardcodedBPK2SamlAttributeMapper()));

    bundIdKeycloakClient.createOrUpdateClientScopes(List.of(clientScope));
  }

  private static ProtocolMapperRepresentation getHardcodedBPK2SamlAttributeMapper() {
    ProtocolMapperRepresentation realmRolesMapper = new ProtocolMapperRepresentation();
    realmRolesMapper.setName("Hardcoded bPK2 attribute");
    realmRolesMapper.setProtocol(SAML);
    realmRolesMapper.setProtocolMapper("saml-hardcode-attribute-mapper");
    realmRolesMapper.setConfig(
        Map.of(
            "attribute.nameformat",
            "Basic",
            "attribute.name",
            BPK2_ATTRIBUTE,
            "friendly.name",
            BPK2_ATTRIBUTE,
            "attribute.value",
            "hardcoded-bPK2-value"));
    return realmRolesMapper;
  }
}
