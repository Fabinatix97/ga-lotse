/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.differ.KeycloakDiffer.toJson;
import static de.eshg.lib.keycloak.UserAttributePermissions.ADMIN_ONLY;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.keycloak.differ.Differ;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.lib.keycloak.KeycloakGroup;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lib.keycloak.KeycloakUser;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.util.*;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;
import java.util.function.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.*;
import org.keycloak.representations.userprofile.config.UPAttribute;
import org.keycloak.representations.userprofile.config.UPAttributePermissions;
import org.keycloak.representations.userprofile.config.UPConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.AnyNestedCondition;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

/** "Extension" of KeycloakClient for test-only functionality */
public class KeycloakTestClient {

  public static final String TEMPORARY_TEST_USER_USERNAME = "temporary_test_user";
  protected final Logger log = LoggerFactory.getLogger(getClass());

  protected final RealmBoundKeycloakClient keycloakClient;

  protected final KeycloakProperties keycloakProperties;
  protected final EnvironmentConfig environmentConfig;
  private final ObjectMapper objectMapper;
  private final int maxNumberOfParallelThreads;

  protected static final class TestHelperOrTestUserProvisioningEnabled extends AnyNestedCondition {

    TestHelperOrTestUserProvisioningEnabled() {
      super(ConfigurationPhase.PARSE_CONFIGURATION);
    }

    @ConditionalOnTestHelperEnabled
    static final class TestHelperEnabled {}

    @ConditionalOnTestUserProvisioningEnabled
    static final class TestUserProvisioningEnabled {}
  }

  public KeycloakTestClient(
      RealmBoundKeycloakClient keycloakClient,
      KeycloakProperties keycloakProperties,
      int maxNumberOfParallelThreads,
      EnvironmentConfig environmentConfig,
      ObjectMapper objectMapper) {
    environmentConfig.assertIsNotProduction();
    this.keycloakClient = keycloakClient;
    this.keycloakProperties = keycloakProperties;
    this.maxNumberOfParallelThreads = maxNumberOfParallelThreads;
    this.environmentConfig = environmentConfig;
    this.objectMapper = objectMapper;
  }

  public void createOrRecreateClient(ClientRepresentation clientRepresentation) {
    keycloakClient
        .getClientByClientId(clientRepresentation.getClientId())
        .ifPresent(ClientResource::remove);
    keycloakClient.addClient(clientRepresentation);
  }

  public void addUsersToGroups(List<KeycloakUser> usersWithGroup) {
    resetGroupMemberships(usersWithGroup);
    for (KeycloakUser user : usersWithGroup) {
      if (user.groups() != null) {
        for (KeycloakGroup group : user.groups()) {
          joinGroup(user.username(), group.getKeycloakName());
        }
      }
    }
  }

  private void resetGroupMemberships(List<KeycloakUser> usersWithGroup) {
    log.info("Resetting group memberships of configured users.");
    List<String> allGroupIds =
        keycloakClient.getGroupsResource().groups().stream()
            .map(GroupRepresentation::getId)
            .toList();

    for (String groupId : allGroupIds) {
      GroupResource groupResource = keycloakClient.getGroupResource(groupId);
      List<UserRepresentation> members = groupResource.members();

      for (UserRepresentation member : members) {
        if (isConfiguredUser(usersWithGroup, member)) {
          keycloakClient.getRealm().users().get(member.getId()).leaveGroup(groupId);
        }
      }
    }
  }

  private static boolean isConfiguredUser(
      List<KeycloakUser> usersWithGroup, UserRepresentation member) {
    return usersWithGroup.stream()
        .anyMatch(user -> Objects.equals(user.username(), member.getUsername()));
  }

  private void joinGroup(String username, String groupName) {
    UserResource user = getUserByNameOrThrow(username);
    GroupResource group = keycloakClient.getGroupByName(groupName);

    if (isUserMemberOfGroup(username, group)) {
      return;
    }
    user.joinGroup(group.toRepresentation().getId());
    log.info("User '{}' joined group '{}'", username, groupName);
  }

  private static boolean isUserMemberOfGroup(String username, GroupResource group) {
    return group.members().stream()
        .anyMatch(person -> Objects.equals(person.getUsername(), username));
  }

  public void createOrUpdateUsers(
      List<KeycloakUser> configuredUsers, BiConsumer<UserRepresentation, KeycloakUser> userUpdate) {
    doWithAllUserAttributesEditable(() -> createOrUpdateUsersInternal(configuredUsers, userUpdate));

    resetUserPasswords(configuredUsers);

    addOrRemoveUserRoleMappings(configuredUsers);
  }

  private void createOrUpdateUsersInternal(
      List<KeycloakUser> configuredUsers, BiConsumer<UserRepresentation, KeycloakUser> userUpdate) {
    UsersResource usersResource = keycloakClient.getRealm().users();
    List<UserRepresentation> existingUsers =
        keycloakClient.getUsers(Integer.MAX_VALUE).stream().filter(this::hasGaLotseEmail).toList();
    List<KeycloakUser> missingUsers = new ArrayList<>(configuredUsers);

    existingUsers.forEach(
        existingUser ->
            updateOrDeleteExistingUser(existingUser, userUpdate, missingUsers, usersResource));
    missingUsers.forEach(
        userConfig -> {
          log.info("Creating user {}", userConfig.username());
          UserRepresentation newUserRepresentation =
              getNewUserRepresentation(userUpdate, userConfig);
          UserResource userResource =
              keycloakClient.createUser(usersResource, newUserRepresentation);
          log.info("Removing default required actions from user {}", userConfig.username());
          UserRepresentation createdUser = userResource.toRepresentation();
          createdUser.getRequiredActions().clear();
          userResource.update(createdUser);
        });
  }

  private boolean hasGaLotseEmail(UserRepresentation userRepresentation) {
    String email = userRepresentation.getEmail();
    if (email == null) {
      return false;
    }
    // TODO ISSUE-8232 remove this after migration
    return email.endsWith(KeycloakUser.TEST_USER_EMAIL_POSTFIX) || email.endsWith("@eshg.de");
  }

  // The existing password can not be queried from keycloak, so there is no way to diff it.
  // Therefore, passwords of all users are always reset, to make sure they are consistent with the
  // configured ones!
  private void resetUserPasswords(List<KeycloakUser> configuredUsers) {
    if (!keycloakProperties.allowPasswordsForEmployees()) {
      log.warn(
          "Tried to reset passwords for test users while passwords are disabled. Change eshg.keycloak.allow-passwords-for-employees to 'true' if password resets are desired.");
      return;
    }
    long start = System.currentTimeMillis();
    // We reset concurrently because it is slow:
    // As of 2024-04-25 it takes ~15s for 55 users when executed sequentially!
    List<Runnable> resetTasks =
        configuredUsers.stream().<Runnable>map(user -> () -> resetUserPassword(user)).toList();
    runConcurrently("reset user passwords", resetTasks, "keycloak-password-reset-");

    log.info(
        "Resetting passwords of {} users took {} ms",
        configuredUsers.size(),
        System.currentTimeMillis() - start);
  }

  private void runConcurrently(String description, List<Runnable> tasks, String threadNamePrefix) {
    // We cannot use virtual threads here, until the keycloak-admin-client updates to apache
    // httpClient version 5.4+ (see ISSUE-2871 for details)
    try (ExecutorService executorService =
        Executors.newFixedThreadPool(
            maxNumberOfParallelThreads, new CustomizableThreadFactory(threadNamePrefix))) {
      ExecutorCompletionService<Void> completionService =
          new ExecutorCompletionService<>(executorService);

      for (Runnable task : tasks) {
        completionService.submit(task, null);
      }

      for (int i = 0; i < tasks.size(); i++) {
        try {
          completionService.take().get(30, TimeUnit.SECONDS);
        } catch (Exception e) {
          executorService.shutdown();
          throw new RuntimeException("Failed to %s concurrently".formatted(description), e);
        }
      }
    }
  }

  private void doWithAllUserAttributesEditable(Runnable runnable) {
    UserProfileResource profileResource = keycloakClient.getRealm().users().userProfile();
    UPConfig profileConfig = profileResource.getConfiguration();

    List<UPAttribute> originalAttributes = profileConfig.getAttributes();
    List<UPAttribute> temporarilyEditableAttributes =
        getTemporarilyEditableAttributes(originalAttributes);

    try {
      log.info("Temporarily configuring user profile attributes to be admin editable");
      profileConfig.setAttributes(temporarilyEditableAttributes);
      profileResource.update(profileConfig);
      runnable.run();
    } finally {
      log.info("Reverting user profile attributes configuration to their original state");
      profileConfig.setAttributes(originalAttributes);
      profileResource.update(profileConfig);
    }
  }

  private List<UPAttribute> getTemporarilyEditableAttributes(List<UPAttribute> originalAttributes) {
    List<UPAttribute> temporaryEditableAttributes;
    temporaryEditableAttributes = copyAttributes(originalAttributes);
    temporaryEditableAttributes.forEach(
        attribute ->
            attribute.setPermissions(
                new UPAttributePermissions(
                    ADMIN_ONLY.viewPermissions(), ADMIN_ONLY.editPermissions())));
    return temporaryEditableAttributes;
  }

  private List<UPAttribute> copyAttributes(List<UPAttribute> originalAttributes) {
    try {
      return objectMapper.readValue(
          objectMapper.writeValueAsString(originalAttributes), new TypeReference<>() {});
    } catch (JsonProcessingException e) {
      throw new IllegalStateException(
          "Failed to de-/serialize user profile attributes for copying", e);
    }
  }

  public void resetUserPassword(KeycloakUser user) {
    if (!keycloakProperties.allowPasswordsForEmployees()) {
      log.warn(
          "Tried to reset passwords for test users while passwords are disabled. Change eshg.keycloak.allow-passwords-for-employees to 'true' if password resets are desired.");
      return;
    }

    String username = user.username();
    UserResource userResource = getUserByNameOrThrow(username);
    log.info("Resetting password of user {}", username);
    String password = user.password();
    if (StringUtils.isNotBlank(keycloakProperties.testUsersSecretOverride())) {
      password = keycloakProperties.testUsersSecretOverride();
      log.info("Overriding password of keycloak test user '{}' with: '{}'", username, password);
    }

    userResource.resetPassword(getPasswordCredentialAttributes(password));
  }

  public void resetUser(KeycloakUser user) {
    String username = user.username();
    UserResource userResource = getUserByNameOrThrow(username);
    log.info("Resetting user {}", username);
    updateExistingUser(
        userResource.toRepresentation(),
        user,
        (representation, configured) -> {
          Map<String, List<String>> attributes =
              UserMapper.mapAttributesToDm(
                  new LinkedHashMap<>(),
                  configured.phoneNumber(),
                  configured.externalChatUsername(),
                  null,
                  null);
          representation.setAttributes(attributes);
          representation.setEnabled(true);
        });
  }

  public void deleteUser(String username) {
    Optional<UserResource> userByName = keycloakClient.getUserResourceByName(username);
    if (userByName.isPresent()) {
      UsersResource usersResource = keycloakClient.getRealm().users();
      usersResource.delete(userByName.get().toRepresentation().getId());
    }
  }

  protected static CredentialRepresentation getPasswordCredentialAttributes(String password) {
    CredentialRepresentation passwordCredentials = new CredentialRepresentation();
    passwordCredentials.setType(CredentialRepresentation.PASSWORD);
    passwordCredentials.setValue(password);
    passwordCredentials.setTemporary(false);
    return passwordCredentials;
  }

  private void updateOrDeleteExistingUser(
      UserRepresentation existingUser,
      BiConsumer<UserRepresentation, KeycloakUser> userUpdate,
      List<KeycloakUser> configuredUsers,
      UsersResource usersResource) {
    Optional<KeycloakUser> configuredUserOpt =
        configuredUsers.stream()
            .filter(u -> existingUser.getUsername().equals(u.username()))
            .collect(StreamUtil.toSingleOptionalElement());

    if (configuredUserOpt.isPresent()) {
      KeycloakUser configuredUser = configuredUserOpt.get();
      updateExistingUser(existingUser, configuredUser, userUpdate);

      configuredUsers.remove(configuredUser);
    } else {
      log.info(
          "Keycloak user {} already exists but shouldn't. Deleting it.",
          existingUser.getUsername());
      usersResource.delete(existingUser.getId());
    }
  }

  private void updateExistingUser(
      UserRepresentation existingUser,
      KeycloakUser configuredUser,
      BiConsumer<UserRepresentation, KeycloakUser> userUpdate) {
    String username = existingUser.getUsername();
    UserResource userResource = getUserByNameOrThrow(username);

    String previousUserAsJson = toJson(existingUser);
    userUpdate.accept(existingUser, configuredUser);

    String updatedUserAsJson = toJson(existingUser);
    if (Objects.equals(previousUserAsJson, updatedUserAsJson)) {
      log.debug("Keycloak user '{}' already exists. No change necessary.", username);
    } else {
      String roleConfigDiff = Differ.calculateMultilineDiff(previousUserAsJson, updatedUserAsJson);
      log.info(
          "Keycloak user '{}' already exists but update is required:\n{}",
          username,
          roleConfigDiff);
      userResource.update(existingUser);
    }
  }

  private UserRepresentation getNewUserRepresentation(
      BiConsumer<UserRepresentation, KeycloakUser> userUpdate, KeycloakUser userConfig) {
    UserRepresentation userRepresentation = new UserRepresentation();
    userUpdate.accept(userRepresentation, userConfig);
    return userRepresentation;
  }

  private void addOrRemoveUserRoleMappings(List<KeycloakUser> configuredUsers) {
    Map<String, RoleRepresentation> roleByName =
        keycloakClient.getSystemRoles().stream()
            .collect(StreamUtil.toLinkedHashMap(RoleRepresentation::getName));

    configuredUsers.forEach(
        userConfig -> {
          List<String> configuredRoleNames = List.of();
          if (userConfig.roles() != null) {
            configuredRoleNames =
                userConfig.roles().stream().map(KeycloakRole::getKeycloakName).toList();
          }

          String username = userConfig.username();
          UserResource user = getUserByNameOrThrow(username);
          RoleScopeResource roleScopeResource = user.roles().realmLevel();
          List<String> existingRoleNames =
              roleScopeResource.listAll().stream()
                  .map(RoleRepresentation::getName)
                  .filter(Predicate.not(keycloakClient.getIgnoredRoleNames()::contains))
                  .sorted()
                  .toList();

          String previousRolesAsJson = toJson(existingRoleNames);
          String updatedRolesAsJson = toJson(configuredRoleNames);
          if (Objects.equals(previousRolesAsJson, updatedRolesAsJson)) {
            log.debug(
                "Keycloak user '{}' already has the correct roles. No change necessary.", username);
          } else {
            String roleConfigDiff =
                Differ.calculateMultilineDiff(previousRolesAsJson, updatedRolesAsJson);
            log.info("Keycloak user '{}' requires role update:\n{}", username, roleConfigDiff);

            updateUserRoleMappings(
                configuredRoleNames, existingRoleNames, roleScopeResource, roleByName);
          }
        });
  }

  private void updateUserRoleMappings(
      List<String> configuredRoleNames,
      List<String> existingRoleNames,
      RoleScopeResource roleScopeResource,
      Map<String, RoleRepresentation> roleByName) {
    List<String> rolesToBeRemoved = new ArrayList<>();
    List<String> rolesToAdd = new ArrayList<>(configuredRoleNames);
    existingRoleNames.forEach(
        existingRoleName -> {
          if (!configuredRoleNames.contains(existingRoleName)) {
            rolesToBeRemoved.add(existingRoleName);
          } else {
            rolesToAdd.remove(existingRoleName);
          }
        });
    if (!rolesToBeRemoved.isEmpty()) {
      roleScopeResource.remove(rolesToBeRemoved.stream().map(roleByName::get).toList());
    }
    if (!rolesToAdd.isEmpty()) {
      roleScopeResource.add(rolesToAdd.stream().map(roleByName::get).toList());
    }
  }

  private UserResource getUserByNameOrThrow(String username) {
    return keycloakClient
        .getUserResourceByName(username)
        .orElseThrow(
            () -> new IllegalStateException("Found no user with username '" + username + "'"));
  }

  public boolean doesUserExist(String username) {
    return keycloakClient.getUserResourceByName(username).isPresent();
  }

  public void invalidateAllSessions(String clientId) {
    ClientResource client = keycloakClient.getClientByClientId(clientId).orElseThrow();

    final List<UserSessionRepresentation> userSessions = client.getUserSessions(null, null);
    for (UserSessionRepresentation userSession : userSessions) {
      keycloakClient.getRealm().deleteSession(userSession.getId(), false);
    }

    if (!userSessions.isEmpty()) {
      log.info(
          "Deleted {} user session{} of client '{}'",
          userSessions.size(),
          userSessions.size() == 1 ? "" : "s",
          clientId);
    }

    final List<UserSessionRepresentation> offlineUserSessions =
        client.getOfflineUserSessions(null, null);
    for (UserSessionRepresentation userSession : offlineUserSessions) {
      keycloakClient.getRealm().deleteSession(userSession.getId(), true);
    }

    if (!offlineUserSessions.isEmpty()) {
      log.info(
          "Deleted {} offline user session{} of client '{}'",
          offlineUserSessions.size(),
          offlineUserSessions.size() == 1 ? "" : "s",
          clientId);
    }
  }

  public void removeUnmanagedUsers(List<String> allUsers) {
    keycloakClient.getUsers(Integer.MAX_VALUE).stream()
        .map(UserRepresentation::getUsername)
        .filter(Predicate.not(allUsers::contains))
        .forEach(this::deleteUser);
  }

  public void resetEvents() {
    keycloakClient.getRealm().clearEvents();
  }
}
