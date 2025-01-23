/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_CRYPTO_VERSION;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_ENCRYPTED_PRIVATE_KEY;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_KEY_IDENTIFIER;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_PUBLIC_KEY;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.keycloak.EmployeeKeycloakClient;
import de.eshg.base.keycloak.EventFilterConfig;
import de.eshg.base.keycloak.KeycloakEventType;
import de.eshg.base.keycloak.KeycloakMapper;
import de.eshg.base.user.api.*;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.base.user.model.EmployeeUserKeys;
import de.eshg.base.user.model.PrivateEmployeeUserKey;
import de.eshg.base.user.model.PublicEmployeeUserKey;
import de.eshg.keycloak.api.user.model.GetActiveSessionResponse;
import de.eshg.keycloak.api.user.model.KeycloakApiGroupMemberDto;
import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.ModuleLeaderGroup;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.UserSessionRepresentation;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  public static final String AUDIT_LOG_CATEGORY = "Benutzerverwaltung Mitarbeiterportal";
  public static final String AUDIT_LOG_KEY_USER_ID = "Benutzer ID";
  private final EmployeeKeycloakClient employeeKeycloakClient;
  private final AuditLogger auditLogger;

  public UserService(EmployeeKeycloakClient employeeKeycloakClient, AuditLogger auditLogger) {
    this.employeeKeycloakClient = employeeKeycloakClient;
    this.auditLogger = auditLogger;
  }

  public List<UserDto> getUsers(UserFilterParameters parameters) {
    return employeeKeycloakClient.getUsers(parameters).stream()
        .map(UserMapper::mapUserToApi)
        .sorted(Comparator.comparing(UserDto::username))
        .toList();
  }

  public List<UserDto> getUsers(Collection<UUID> userIds) {
    return getUsers(userIds, false);
  }

  public List<UserDto> getUsers(Collection<UUID> userIds, boolean ignoreUnknownId) {
    return employeeKeycloakClient
        .getUsersById(new ArrayList<>(new LinkedHashSet<>(userIds)), ignoreUnknownId)
        .stream()
        .map(UserMapper::mapUserToApi)
        .toList();
  }

  public UserRepresentation getUserByIdOrThrow(UUID userId) {
    return getUserById(userId).orElseThrow(() -> new NotFoundException("User not found"));
  }

  public Optional<UserRepresentation> getUserById(UUID userId) {
    try {
      return Optional.of(
          employeeKeycloakClient.getRealm().users().get(userId.toString()).toRepresentation());
    } catch (jakarta.ws.rs.NotFoundException e) {
      return Optional.empty();
    }
  }

  public UserRepresentation getSelfUser() {
    return employeeKeycloakClient.getSelfUser().toRepresentation();
  }

  public GetActiveSessionResponse getSelfActiveSessions() {
    return employeeKeycloakClient.getSelfActiveSessions();
  }

  public void invalidateSessions(List<UUID> sessionIds) {
    Set<String> sessionSet = sessionIds.stream().map(UUID::toString).collect(Collectors.toSet());

    RealmResource realm = employeeKeycloakClient.getRealm();
    employeeKeycloakClient.getSelfUser().getUserSessions().stream()
        .map(UserSessionRepresentation::getId)
        .filter(sessionSet::contains)
        .forEach(
            sessionId -> {
              realm.deleteSession(sessionId, false);
            });
  }

  public UserRepresentation updateUser(
      String id, Consumer<? super UserRepresentation> updateFunction) {
    UserResource resource = employeeKeycloakClient.getRealm().users().get(id);
    UserRepresentation representation = resource.toRepresentation();
    updateFunction.accept(representation);
    resource.update(representation);

    auditLogUpdateUser(id);
    return resource.toRepresentation();
  }

  public List<String> getUserKeycloakRoles() {
    return employeeKeycloakClient.getSelfUser().roles().realmLevel().listEffective().stream()
        .map(RoleRepresentation::getName)
        .toList();
  }

  public List<UserRepresentation> getUsersByGroup(String groupName) {
    GroupResource group = employeeKeycloakClient.getGroupByName(groupName);
    return group.members();
  }

  public List<KeycloakApiGroupMemberDto> getGroupMembers(List<String> groupNames) {
    return employeeKeycloakClient.getGroupMembers(groupNames);
  }

  public List<String> getUserKeycloakGroups() {
    return employeeKeycloakClient.getSelfUser().groups().stream()
        .map(GroupRepresentation::getName)
        .sorted()
        .toList();
  }

  public List<String> getUserGroups(UUID id) {
    return employeeKeycloakClient.getRealm().users().get(id.toString()).groups().stream()
        .map(GroupRepresentation::getName)
        .sorted()
        .toList();
  }

  public List<KeycloakApiUserDto> getTeamLeadersByGroups(
      Set<ModuleLeaderGroup> moduleLeaderGroups) {
    List<String> groupNames =
        moduleLeaderGroups.stream().map(ModuleLeaderGroup::getKeycloakName).toList();
    return getGroupMembers(groupNames).stream().map(KeycloakApiGroupMemberDto::user).toList();
  }

  public UserDto addUser(UserRepresentation user) {
    Set<String> knownGroups =
        employeeKeycloakClient.getRealm().groups().groups().stream()
            .map(GroupRepresentation::getName)
            .collect(Collectors.toSet());
    for (String group : user.getGroups()) {
      if (!knownGroups.contains(group)) {
        throw new BadRequestException("Group with name '%s' not found".formatted(group));
      }
    }

    Set<String> selfGroups = new HashSet<>(getUserGroups(CurrentUserHelper.getCurrentUserId()));

    for (String suggestedGroup : user.getGroups()) {
      if (!selfGroups.contains(suggestedGroup)) {
        throw new BadRequestException(
            ErrorCode.INSUFFICIENT_USER_RIGHTS,
            "Cannot suggest user with group '" + suggestedGroup + "'");
      }
    }

    UserRepresentation createdUser = employeeKeycloakClient.createUser(user).toRepresentation();
    auditLogAddUser(createdUser);

    return UserMapper.mapUserToApi(createdUser);
  }

  public EmployeeUserKeys addEmployeeUserKeys(EmployeeUserKeys employeeUserKeys) {

    EmployeeUserKeys addedUserKeys = employeeKeycloakClient.addUserKeys(employeeUserKeys);
    auditLogAddUserKeys(addedUserKeys);

    return addedUserKeys;
  }

  public List<PublicEmployeeUserKey> getAllPublicEmployeeUserKeys() {
    return employeeKeycloakClient.getUsers(UserRoleDto.AUDITLOG_DECRYPT_AND_ACCESS).stream()
        .filter(EmployeeKeycloakClient::containsEmployeeUserKey)
        .map(KeycloakMapper::mapKeycloakApiUserToPublicUserKey)
        .toList();
  }

  public PrivateEmployeeUserKey getPrivateEmployeeUserKey() {
    UserRepresentation selfUserRepresentation =
        employeeKeycloakClient.getSelfUser().toRepresentation();
    if (!EmployeeKeycloakClient.containsEmployeeUserKey(selfUserRepresentation)) {
      throw new NotFoundException("No private key found");
    }
    return KeycloakMapper.mapUserRepresentationToPrivateEmployeeUserKey(selfUserRepresentation);
  }

  public void deleteEmployeeUserKeys() {
    UserResource selfUserResource = employeeKeycloakClient.getSelfUser();
    UserRepresentation selfUserRepresentation = selfUserResource.toRepresentation();

    if (!EmployeeKeycloakClient.containsEmployeeUserKey(selfUserRepresentation)) {
      throw new NotFoundException("No keys found");
    }

    Map<String, List<String>> attributes = selfUserRepresentation.getAttributes();
    attributes.remove(AUDIT_LOG_ENCRYPTED_PRIVATE_KEY.getKey());
    attributes.remove(AUDIT_LOG_PUBLIC_KEY.getKey());
    attributes.remove(AUDIT_LOG_CRYPTO_VERSION.getKey());
    attributes.remove(AUDIT_LOG_KEY_IDENTIFIER.getKey());

    selfUserResource.update(selfUserRepresentation);

    auditLogDeleteUserKeys(selfUserRepresentation);
  }

  private void auditLogAddUser(UserRepresentation createdUser) {
    writeAuditLog(
        "Hinzufügen Benutzer",
        Map.of(
            AUDIT_LOG_KEY_USER_ID,
            createdUser.getId(),
            "Benutzer aktiviert",
            mapUserEnabled(createdUser)));
  }

  private void writeAuditLog(String function, Map<String, String> optionalParameters) {
    Map<String, String> additionalParameters = new LinkedHashMap<>(optionalParameters);

    additionalParameters.put("durch Benutzer", mapCurrentUserId());
    auditLogger.log(AUDIT_LOG_CATEGORY, function, additionalParameters);
  }

  private static String mapCurrentUserId() {
    return CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-");
  }

  private static String mapUserEnabled(UserRepresentation createdUser) {
    Boolean enabled = createdUser.isEnabled();
    return enabled ? "ja" : "nein";
  }

  private void auditLogUpdateUser(String id) {
    writeAuditLog("Editiere Benutzer", Map.of(AUDIT_LOG_KEY_USER_ID, id));
  }

  private void auditLogAddUserKeys(EmployeeUserKeys addedUserKeys) {
    String userId = mapCurrentUserId();
    writeAuditLog(
        "Hinzufügen Schlüsselpaar",
        Map.of(AUDIT_LOG_KEY_USER_ID, userId, "Schlüssel ID", addedUserKeys.keyIdentifier()));
  }

  private void auditLogDeleteUserKeys(UserRepresentation selfUserRepresentation) {
    writeAuditLog(
        "Löschen Schlüsselpaar", Map.of(AUDIT_LOG_KEY_USER_ID, selfUserRepresentation.getId()));
  }

  public List<EventRepresentation> getUserEvents(
      UserRepresentation user, int offset, int limit, Set<KeycloakEventType> types) {
    return employeeKeycloakClient.getUserEvents(
        new EventFilterConfig(user.getId(), null, types, null, null, offset, limit));
  }

  public Set<BusinessModule> getSelfBusinessModules() {
    Set<ModuleMemberGroup> selfMemberGroups =
        getUserKeycloakGroups().stream()
            .map(ModuleMemberGroup::fromValueGracefullyOrNull)
            .filter(Objects::nonNull)
            .collect(StreamUtil.toLinkedHashSet());

    return Arrays.stream(BusinessModule.values())
        .filter(UserService.isSelfBusinessModuleFilter(selfMemberGroups))
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static Predicate<BusinessModule> isSelfBusinessModuleFilter(
      Set<ModuleMemberGroup> selfMemberGroups) {
    return businessModule ->
        selfMemberGroups.contains(KeycloakMapper.mapModuleToGroup(businessModule));
  }
}
