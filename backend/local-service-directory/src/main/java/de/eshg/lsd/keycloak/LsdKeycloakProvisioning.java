/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import static de.eshg.lib.keycloak.KeycloakUserAttribute.DEFAULT_ATTRIBUTE_EMAIL;
import static de.eshg.lib.keycloak.UserAttributePermissions.ADMIN_ONLY;
import static de.eshg.lsd.keycloak.PermissionRole.LSD_WRITE_TECH_USER;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.commons.lang.SetUtils;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lib.keycloak.KeycloakUserAttribute;
import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.lsd.keycloak.properties.LsdKeycloakSetupProperties;
import de.eshg.lsd.register.api.LsdClientKeycloakProperties;
import de.eshg.lsd.service.LsdAttributeKey;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.admin.client.resource.ClientsResource;
import org.keycloak.admin.client.resource.UserProfileResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.ClientScopeRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.ProtocolMapperRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.userprofile.config.UPAttribute;
import org.keycloak.representations.userprofile.config.UPAttributePermissions;
import org.keycloak.representations.userprofile.config.UPConfig;
import org.keycloak.representations.userprofile.config.UPGroup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The purpose of this component is to encapsulate ESHG-LSD-specific logic for provisioning
 * Keycloak.
 */
@Component
public class LsdKeycloakProvisioning {

  private static final Logger log = LoggerFactory.getLogger(LsdKeycloakProvisioning.class);

  private static final String ESHG_CLIENT_SCOPE_NAME = "eshg";
  private static final String OPENID_CONNECT = "openid-connect";
  private static final String ID_TOKEN_CLAIM = "id.token.claim";
  private static final String USERINFO_TOKEN_CLAIM = "userinfo.token.claim";
  private static final String ACCESS_TOKEN_CLAIM = "access.token.claim";
  private static final String USE_REFRESH_TOKENS_ATTRIBUTE = "use.refresh.tokens";
  private static final String CLAIM_NAME = "claim.name";
  private static final String FALSE = "false";
  private static final String TRUE = "true";

  private final Optional<String> importFile;
  private final Integer certificateAttributeMaxCharacters;
  private final LsdKeycloakClient keycloakClient;
  private final LsdKeycloakSetupProperties lsdKeycloakSetupProperties;
  private final LsdClientKeycloakProperties lsdClientKeycloakProperties;

  public LsdKeycloakProvisioning(
      LsdKeycloakClient keycloakClient,
      LsdKeycloakSetupProperties lsdKeycloakSetupProperties,
      @Value("${eshg.lsd-keycloak.importfile:#{null}}") Optional<String> importFile,
      @Value("${eshg.lsd-keycloak.certificate-attribute-max-characters:#{null}}")
          Integer certificateAttributeMaxCharacters,
      LsdClientKeycloakProperties lsdClientKeycloakProperties) {
    this.keycloakClient = keycloakClient;
    this.lsdKeycloakSetupProperties = lsdKeycloakSetupProperties;
    this.importFile = importFile;
    this.certificateAttributeMaxCharacters = certificateAttributeMaxCharacters;
    this.lsdClientKeycloakProperties = lsdClientKeycloakProperties;
  }

  private static void setAttribute(
      RealmRepresentation realmRepresentation, String key, String value) {
    Map<String, String> attributes = realmRepresentation.getAttributes();
    if (attributes == null) {
      realmRepresentation.setAttributes(Map.of(key, value));
    } else {
      attributes.put(key, value);
    }
  }

  private static ProtocolMapperRepresentation getRealmRolesMapper() {
    ProtocolMapperRepresentation realmRolesMapper = new ProtocolMapperRepresentation();
    realmRolesMapper.setName("Realm Roles");
    realmRolesMapper.setProtocol(OPENID_CONNECT);
    realmRolesMapper.setProtocolMapper("oidc-usermodel-realm-role-mapper");
    realmRolesMapper.setConfig(
        Map.of(
            "multivalued",
            TRUE,
            ID_TOKEN_CLAIM,
            FALSE,
            USERINFO_TOKEN_CLAIM,
            TRUE,
            ACCESS_TOKEN_CLAIM,
            TRUE,
            CLAIM_NAME,
            KeycloakRole.CLAIM_NAME));
    return realmRolesMapper;
  }

  private static ProtocolMapperRepresentation getUsernameMapper() {
    ProtocolMapperRepresentation usernameMapper = new ProtocolMapperRepresentation();
    usernameMapper.setName("User identifier");
    usernameMapper.setProtocol(OPENID_CONNECT);
    usernameMapper.setProtocolMapper("oidc-usermodel-property-mapper");
    usernameMapper.setConfig(
        Map.of(
            "user.attribute",
            "username",
            ID_TOKEN_CLAIM,
            TRUE,
            USERINFO_TOKEN_CLAIM,
            TRUE,
            ACCESS_TOKEN_CLAIM,
            TRUE,
            CLAIM_NAME,
            "sub"));
    return usernameMapper;
  }

  @PostConstruct
  void provisionRealm() {
    configureRealm();
    disableUnusedClients();

    boolean isNew =
        keycloakClient.getRealm().clients().findByClientId(keycloakClient.getClientId()).isEmpty();

    configureUserProfile();

    if (isNew) {
      addEshgClientScope();

      addClient();
      updateRequiredActions();

      for (PermissionRole role : PermissionRole.values()) {
        keycloakClient.addRole(role);
      }
    }
    importFile.ifPresent(this::importFromFile);
  }

  private void disableUnusedClients() {
    Set<String> disabledClients = Set.of("admin-cli", "account", "account-console", "broker");

    ClientsResource clients = keycloakClient.getRealm().clients();
    for (ClientRepresentation client : clients.findAll()) {
      if (disabledClients.contains(client.getClientId())) {
        client.setEnabled(false);
        ClientResource resource = clients.get(client.getId());
        resource.update(client);
      }
    }
  }

  void importFromFile(String importFile) {
    try (InputStream inputStream = Files.newInputStream(Path.of(importFile))) {
      log.debug("Importing configuration from '{}'", importFile);
      ObjectMapper mapper = new ObjectMapper();
      List<UsernamePassword> users = mapper.readValue(inputStream, new TypeReference<>() {});
      users.forEach(
          user -> {
            Optional<UserResource> existing = keycloakClient.getUserByName(user.username());
            if (existing.isPresent()) {
              log.info("updating password for existing user {} from importfile", user.username());
              CredentialRepresentation passwordCredentials = new CredentialRepresentation();
              passwordCredentials.setType(CredentialRepresentation.PASSWORD);
              passwordCredentials.setValue(user.password());
              passwordCredentials.setTemporary(false);
              existing.get().resetPassword(passwordCredentials);
              // TODO ISSUE-8232 remove this after migration
              UserRepresentation representation = existing.get().toRepresentation();
              representation.setEmail("");
              existing.get().update(representation);
            } else {
              keycloakClient.addUser(user.username(), user.password(), LSD_WRITE_TECH_USER);
              log.info("created user {} from importfile", user.username());
            }
          });
      log.info("Imported configuration from '{}'", importFile);
    } catch (IOException e) {
      log.warn("Not importing '{}' because", importFile, e);
    }
  }

  public void configureRealm() {
    keycloakClient.configureRealm(this::applyRealmAttributes);
  }

  private void applyRealmAttributes(RealmRepresentation realmRepresentation) {
    String realmDisplayName = lsdKeycloakSetupProperties.realmDisplayName();
    realmRepresentation.setDisplayName(realmDisplayName);
    realmRepresentation.setDisplayNameHtml(realmDisplayName);
    realmRepresentation.setInternationalizationEnabled(true);
    realmRepresentation.setSupportedLocales(SetUtils.orderedSet("de", "en"));
    realmRepresentation.setPasswordPolicy("regexPattern([A-Za-z0-9-]{32,})");
    realmRepresentation.setDefaultLocale("de");
    realmRepresentation.setAdminEventsEnabled(true);
    realmRepresentation.setEventsEnabled(true);
    realmRepresentation.setEventsExpiration(
        lsdKeycloakSetupProperties.eventExpiration().toSeconds());
    realmRepresentation.setSsoSessionIdleTimeout(
        (int) lsdKeycloakSetupProperties.sessionTimeout().toSeconds());
    realmRepresentation.setBruteForceProtected(true);
    realmRepresentation.setRevokeRefreshToken(true);
    setAttribute(
        realmRepresentation,
        "adminEventsExpiration",
        String.valueOf(Duration.ofDays(7).toSeconds()));
    setAttribute(realmRepresentation, "frontendUrl", lsdClientKeycloakProperties.url());
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

  private void configureUserProfile() {
    UserProfileResource profileResource = keycloakClient.getRealm().users().userProfile();
    UPConfig profileConfig = profileResource.getConfiguration();

    UPGroup group = new UPGroup("eshg");
    group.setDisplayHeader("ESHG");
    group.setDisplayDescription("Custom attributes for LSD realm");

    if (profileConfig.getGroups().stream().noneMatch(g -> group.getName().equals(g.getName()))) {
      profileConfig.addGroup(group);
    }
    for (String defaultAttribute : KeycloakUserAttribute.defaultAttributes) {
      UPAttribute attribute = profileConfig.getAttribute(defaultAttribute);
      attribute.setPermissions(
          new UPAttributePermissions(ADMIN_ONLY.viewPermissions(), ADMIN_ONLY.editPermissions()));
      if (StringUtils.equals(defaultAttribute, DEFAULT_ATTRIBUTE_EMAIL)) {
        attribute.setRequired(null);
        attribute.addValidation("length", Map.of("max", 0));
      }
      profileConfig.addOrReplaceAttribute(attribute);
    }
    for (LsdAttributeKey attribute : LsdAttributeKey.values()) {
      profileConfig.addOrReplaceAttribute(getAttributeConfig(attribute, group));
    }

    profileResource.update(profileConfig);
  }

  private UPAttribute getAttributeConfig(LsdAttributeKey attribute, UPGroup group) {
    UPAttribute attributeConfig = new UPAttribute(attribute.getKey());

    if (attribute.getMaxLength() != null) {
      attributeConfig.setValidations(getCertificateValidatorConfig(attribute.getMaxLength()));
    }

    attributeConfig.setMultivalued(attribute == LsdAttributeKey.CERTIFICATE);
    attributeConfig.setGroup(group.getName());
    attributeConfig.setPermissions(
        new UPAttributePermissions(ADMIN_ONLY.viewPermissions(), ADMIN_ONLY.editPermissions()));
    return attributeConfig;
  }

  private Map<String, Map<String, Object>> getCertificateValidatorConfig(int maxLength) {
    Map<String, Object> config =
        Map.of(
            "min",
            "0",
            // we want to increase the limit as certificates are too long
            "max",
            Optional.ofNullable(certificateAttributeMaxCharacters).orElse(maxLength),
            // we don't want values be trimmed before checking the length
            "trim-disabled",
            true);

    return Map.of("length", config);
  }

  private void addClient() {
    ClientRepresentation clientRepresentation = new ClientRepresentation();
    clientRepresentation.setClientId(keycloakClient.getClientId());
    clientRepresentation.setName("Client for ESHG actors");
    clientRepresentation.setPublicClient(false);
    clientRepresentation.setDirectAccessGrantsEnabled(true);
    clientRepresentation.setStandardFlowEnabled(false);
    clientRepresentation.setAttributes(Map.of(USE_REFRESH_TOKENS_ATTRIBUTE, FALSE));
    clientRepresentation.setSecret(keycloakClient.getClientSecret());
    addClient(clientRepresentation);
  }

  private void addClient(ClientRepresentation clientRepresentation) {
    clientRepresentation.setDefaultClientScopes(List.of(ESHG_CLIENT_SCOPE_NAME));
    clientRepresentation.setOptionalClientScopes(List.of(OAuth2Constants.SCOPE_PROFILE));
    keycloakClient.addClient(clientRepresentation);
  }

  private void addEshgClientScope() {
    ClientScopeRepresentation clientScope = new ClientScopeRepresentation();
    clientScope.setName(ESHG_CLIENT_SCOPE_NAME);
    clientScope.setDescription(
        "Sets the user id as sub, the groups and the roles as scope in the token");
    clientScope.setProtocol(OPENID_CONNECT);
    clientScope.setAttributes(Map.of("include.in.token.scope", FALSE));

    ProtocolMapperRepresentation usernameMapper = getUsernameMapper();

    ProtocolMapperRepresentation realmRolesMapper = getRealmRolesMapper();

    clientScope.setProtocolMappers(List.of(usernameMapper, realmRolesMapper));
    keycloakClient.addClientScope(clientScope);
  }

  private UsersResource getUsers() {
    return keycloakClient.getRealm().users();
  }

  private List<UserRepresentation> getUsersList() {
    return getUsers().list();
  }

  public void deleteUsers() {
    getUsersList().forEach(this::deleteUser);
  }

  private void deleteUser(UserRepresentation user) {
    try (Response response = getUsers().delete(user.getId())) {
      if (response.getStatusInfo().getFamily() != Response.Status.Family.SUCCESSFUL) {
        log.warn("Could not delete user with id {}", user.getId());
      } else {
        log.info("Deleted user with id {}", user.getId());
      }
    }
  }
}
