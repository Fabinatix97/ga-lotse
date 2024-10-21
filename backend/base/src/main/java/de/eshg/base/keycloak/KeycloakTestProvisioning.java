/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_ID_PREFIX;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_NAME_PREFIX;

import de.eshg.base.user.mapper.UserMapper;
import de.eshg.lib.keycloak.KeycloakGroup;
import de.eshg.lib.keycloak.KeycloakUser;
import de.eshg.lib.keycloak.PermissionRole;
import de.eshg.testhelper.environment.EnvironmentConfig;
import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class KeycloakTestProvisioning {
  protected final Logger log = LoggerFactory.getLogger(getClass());
  public static final String TEST_HELPER_CLIENT_ID = SYSTEM_CLIENT_ID_PREFIX + "eshg-test-helper";
  private static final String ACCESS_TOKEN_LIFESPAN_ATTRIBUTE = "access.token.lifespan";
  private static final Duration TEST_HELPER_CLIENT_ACCESS_TOKEN_LIFESPAN = Duration.ofHours(2);
  protected final KeycloakTestClient keycloakTestClient;
  protected final KeycloakProperties keycloakProperties;
  protected final EnvironmentConfig environmentConfig;

  protected KeycloakTestProvisioning(
      KeycloakTestClient keycloakTestClient,
      KeycloakProperties keycloakProperties,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    this.keycloakTestClient = keycloakTestClient;
    this.keycloakProperties = keycloakProperties;
    this.environmentConfig = environmentConfig;
  }

  @PostConstruct
  void provisionTestResources() {
    environmentConfig.assertIsNotProduction();
    if (keycloakProperties.testClientEnabled()) {
      log.warn("Adding a test client with direct access grant");
      createOrRecreateClientForTestHelper();
    }
    createOrUpdateUsers();
  }

  protected void createOrRecreateClientForTestHelper() {
    ClientRepresentation clientRepresentation = new ClientRepresentation();
    clientRepresentation.setClientId(TEST_HELPER_CLIENT_ID);
    clientRepresentation.setName(SYSTEM_CLIENT_NAME_PREFIX + "Client for ESHG test helper");
    clientRepresentation.setPublicClient(true);
    clientRepresentation.setDirectAccessGrantsEnabled(true);
    clientRepresentation.setAttributes(
        Map.of(
            ACCESS_TOKEN_LIFESPAN_ATTRIBUTE,
            String.valueOf(TEST_HELPER_CLIENT_ACCESS_TOKEN_LIFESPAN.toSeconds())));
    KeycloakProvisioning.setEshgClientScopes(clientRepresentation);
    keycloakTestClient.createOrRecreateClient(clientRepresentation);
  }

  public void createOrUpdateUsers() {
    environmentConfig.assertIsNotProduction();
    List<KeycloakUser> allUsers = getAllKeycloakUsersToProvision();
    keycloakTestClient.createOrUpdateUsers(allUsers, this::configureUser);
  }

  public void removeUnmanagedUsers() {
    environmentConfig.assertIsNotProduction();
    List<String> allUsers =
        getAllKeycloakUsersToProvision().stream().map(KeycloakUser::username).toList();
    keycloakTestClient.removeUnmanagedUsers(allUsers);
  }

  protected abstract List<KeycloakUser> getAllKeycloakUsersToProvision();

  protected static List<KeycloakTestUser> getPermissionRoleUsers(PermissionRole[] permissionRoles) {
    return Stream.of(permissionRoles)
        .map(
            role ->
                new KeycloakTestUser(
                    role.name().toLowerCase(Locale.ROOT),
                    null,
                    null,
                    "John",
                    "Doe",
                    "password",
                    role))
        .toList();
  }

  private void configureUser(UserRepresentation userRepresentation, KeycloakUser user) {
    userRepresentation.setUsername(user.username());
    userRepresentation.setEmail(user.email());
    userRepresentation.setEmailVerified(true);
    userRepresentation.setFirstName(user.firstName());
    userRepresentation.setLastName(user.lastName());
    userRepresentation.setEnabled(true);
    userRepresentation.setRequiredActions(List.of());
    if (user.groups() != null) {
      userRepresentation.setGroups(
          user.groups().stream().map(KeycloakGroup::getKeycloakName).toList());
    }

    Map<String, List<String>> attributes =
        UserMapper.mapAttributesToDm(
            new LinkedHashMap<>(), user.phoneNumber(), user.externalChatUsername());
    userRepresentation.setAttributes(!attributes.isEmpty() ? attributes : null);
  }
}
