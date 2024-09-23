/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;
import static de.eshg.base.keycloak.KeycloakProvisioning.TRUE;

import de.eshg.base.keycloak.differ.ComponentRepresentationDiffer;
import de.eshg.lib.keycloak.*;
import jakarta.ws.rs.core.Response;
import java.util.*;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.representations.idm.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component
@DependsOn(CitizenKeycloakProvisioning.BEAN_NAME)
@ConditionalOnProperty(value = "eshg.keycloak.provision-test-users")
public class CitizenKeycloakTestProvisioning extends KeycloakTestProvisioning {
  public static final String MUK_TEST_REALM_NAME = "muk-test";
  public static final String KEY_PROVIDER_TYPE = "org.keycloak.keys.KeyProvider";
  public static final String KEY_PRIORITY = "100";

  private final CitizenKeycloakClient citizenKeycloakClient;
  private final RealmBoundKeycloakClient mukKeycloakClient;

  public CitizenKeycloakTestProvisioning(
      CitizenKeycloakTestClient citizenKeycloakTestClient,
      CitizenKeycloakClient citizenKeycloakClient,
      KeycloakProperties keycloakProperties) {
    super(citizenKeycloakTestClient, keycloakProperties);
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.mukKeycloakClient = new RealmBoundKeycloakClient(keycloakProperties, MUK_TEST_REALM_NAME);
  }

  @Override
  void provisionTestResources() {
    super.provisionTestResources();

    if (keycloakProperties.mukTestRealm().enabled()) {
      log.warn("Adding a muk realm for development");
      createOrUpdateDummyMukRealm();
      createOrUpdateMukKeys();
      createOrUpdateSamlClientInMukDummyRealm();
      addTestUserToMukRealm();
    }
  }

  private void createOrUpdateMukKeys() {
    ComponentRepresentationDiffer keysDiffer =
        new ComponentRepresentationDiffer(getExistingKeys(), List.of(getSignatureKeyProvider()));
    keysDiffer.getElementsToDelete().forEach(this::deleteMukKey);
    keysDiffer.getElementsToAdd().forEach(this::addMukKey);
    keysDiffer.getElementsToUpdate().forEach(this::updateMukKey);
  }

  private void deleteMukKey(ComponentRepresentation representation) {
    log.info("Removing key provider '{}' from muk realm", representation.getName());
    mukKeycloakClient.getRealm().components().component(representation.getId()).remove();
  }

  private void addMukKey(ComponentRepresentation representation) {
    log.info("Adding key provider '{}' to muk realm", representation.getName());
    try (Response response = mukKeycloakClient.getRealm().components().add(representation)) {
      RealmBoundKeycloakClient.assertResponseIs201Created(response);
    }
  }

  private void updateMukKey(ToUpdate<ComponentRepresentation> update) {
    ComponentRepresentation keyProvider = update.newState();
    log.info(
        "Key provider '{}' already exists, but update is required: {}",
        keyProvider.getName(),
        update.multiLineDiff());
    mukKeycloakClient.getRealm().components().component(keyProvider.getId()).update(keyProvider);
  }

  private ComponentRepresentation getSignatureKeyProvider() {
    ComponentRepresentation keyProvider = new ComponentRepresentation();
    keyProvider.setName("muk-rsa-signature");
    keyProvider.setProviderId("rsa");
    keyProvider.setProviderType(KEY_PROVIDER_TYPE);
    keyProvider.setConfig(
        new MultivaluedHashMap<>(
            Map.of(
                "privateKey", List.of(keycloakProperties.mukTestRealm().signatureKey()),
                "certificate",
                    List.of(keycloakProperties.citizenRealm().mukIdp().signingCertificate()),
                "priority", List.of(KEY_PRIORITY),
                "active", List.of(TRUE),
                "enabled", List.of(TRUE),
                "algorithm", List.of("RS256"))));
    return keyProvider;
  }

  private List<ComponentRepresentation> getExistingKeys() {
    return mukKeycloakClient.getRealm().components().query(null, KEY_PROVIDER_TYPE).stream()
        .sorted(Comparator.comparing(ComponentRepresentation::getName))
        .toList();
  }

  private void addTestUserToMukRealm() {
    new KeycloakTestClient(mukKeycloakClient, keycloakProperties, 16)
        .createOrUpdateUsers(List.of(MukTestUser.values()), this::configureMukUser);
  }

  private void configureMukUser(UserRepresentation userRepresentation, KeycloakUser user) {
    userRepresentation.setUsername(user.username());
    userRepresentation.setEmail(user.email());
    userRepresentation.setEmailVerified(true);
    userRepresentation.setEnabled(true);
    userRepresentation.setRequiredActions(List.of());
    userRepresentation.setAttributes(null);
  }

  private void createOrUpdateDummyMukRealm() {
    mukKeycloakClient.createOrUpdateRealm(this::getRealmRepresentation);
    mukKeycloakClient.configureUserProfile(
        MukUserAttribute.values(), MUK_TEST_REALM_NAME, MUK_TEST_REALM_NAME);
  }

  private void getRealmRepresentation(RealmRepresentation realmRepresentation) {
    realmRepresentation.setRealm(MUK_TEST_REALM_NAME);
    realmRepresentation.setDisplayName("MUK (Dev)");
    realmRepresentation.setDisplayNameHtml("MUK (Dev)");
    realmRepresentation.setEnabled(true);
  }

  private void createOrUpdateSamlClientInMukDummyRealm() {
    String brokerEndpoint =
        "%s/realms/%s/broker/%s/endpoint"
            .formatted(
                keycloakProperties.url(),
                keycloakProperties.citizenRealm().name(),
                CitizenKeycloakProvisioning.MUK_IDENTITY_PROVIDER_ALIAS);
    List<KeysMetadataRepresentation.KeyMetadataRepresentation> keys =
        citizenKeycloakClient.getRealm().keys().getKeyMetadata().getKeys();

    ClientRepresentation client = new ClientRepresentation();
    // The clientId must match the issuer of the SAML AuthnRequest
    String clientId =
        "%s/realms/%s"
            .formatted(keycloakProperties.url(), keycloakProperties.citizenRealm().name());
    client.setClientId(clientId);
    client.setProtocol("saml");
    client.setPublicClient(false);
    client.setSecret("uEitAacifz6pDUeGAm1XK0elya0BaYxt");
    client.setFullScopeAllowed(true);
    client.setRedirectUris(List.of(brokerEndpoint));
    client.setWebOrigins(List.of("+"));
    client.setFrontchannelLogout(false);
    client.setDefaultClientScopes(List.of("role_list"));
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
    mukKeycloakClient
        .getClientByClientId(clientId)
        .ifPresent(existingClient -> setDefaultValuesForDiff(existingClient, attributes));
    client.setAttributes(attributes);
    mukKeycloakClient.createOrUpdateClients(
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

  private enum MukUserAttribute implements KeycloakUserAttribute {
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

    MukUserAttribute(String key, String displayName) {
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
  }

  private enum MukTestUser implements KeycloakUser {
    MUK_DUMMY("muk-dummy", "password", "muk-dummy" + KeycloakUser.TEST_USER_EMAIL_POSTFIX),
    ;

    private final String username;
    private final String password;
    private final String email;

    MukTestUser(String username, String password, String email) {
      this.username = username;
      this.password = password;
      this.email = email;
    }

    @Override
    public String username() {
      return username;
    }

    @Override
    public String email() {
      return email;
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
}
