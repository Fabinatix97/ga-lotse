/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_ENCRYPTED_PRIVATE_KEY;

import de.eshg.base.keycloak.differ.KeycloakDiffer;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.base.user.api.UserRoleDto;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.base.user.model.EmployeeUserKeys;
import de.eshg.base.util.KeycloakUtil;
import de.eshg.keycloak.api.user.KeycloakUserApi;
import de.eshg.keycloak.api.user.model.BulkGetUsersRequest;
import de.eshg.keycloak.api.user.model.GetActiveSessionResponse;
import de.eshg.keycloak.api.user.model.GetGroupMembersRequest;
import de.eshg.keycloak.api.user.model.GetRoleMembersRequest;
import de.eshg.keycloak.api.user.model.GetRoleMembersResponse;
import de.eshg.keycloak.api.user.model.KeycloakApiGroupMemberDto;
import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.*;
import org.keycloak.admin.client.resource.RoleScopeResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component
@DependsOn(MasterKeycloakProvisioning.BEAN_NAME)
public class EmployeeKeycloakClient extends RealmBoundKeycloakClient {

  private final KeycloakUserApi keycloakUserApi;

  public EmployeeKeycloakClient(KeycloakProperties keycloakProperties) {
    super(keycloakProperties, keycloakProperties.employeeRealm().name());

    String keycloakUrl = keycloakProperties.internal().url();
    URI target = UriBuilder.fromUri(keycloakUrl).build();
    keycloakUserApi = keycloak.proxy(KeycloakUserApi.class, target);
  }

  public GetActiveSessionResponse getSelfActiveSessions() {
    return this.keycloakUserApi.getActiveUserSessions(
        realmName, CurrentUserHelper.getCurrentUserId().toString());
  }

  public List<KeycloakApiUserDto> getUsersById(List<UUID> userIds, boolean ignoreUnknownId) {
    try {
      return keycloakUserApi
          .getUsersBulk(realmName, new BulkGetUsersRequest(userIds, ignoreUnknownId))
          .users();
    } catch (NotFoundException notFound) {
      KeycloakError keycloakError = notFound.getResponse().readEntity(KeycloakError.class);
      if (keycloakError.error().equals("User with given id not found")) {
        throw new de.eshg.rest.service.error.NotFoundException("Some users could not be found");
      }

      throw new IllegalStateException("Unexpected exception for bulk get user by id", notFound);
    }
  }

  record KeycloakError(String error) {}

  public List<KeycloakApiGroupMemberDto> getGroupMembers(List<String> groupNames) {
    return keycloakUserApi
        .getGroupMembers(realmName, new GetGroupMembersRequest(groupNames))
        .groupMembers();
  }

  public List<KeycloakApiUserDto> getUsers(UserFilterParameters filter) {
    GetRoleMembersResponse roleMembers =
        keycloakUserApi.getRoleMembers(
            realmName,
            new GetRoleMembersRequest(
                filter.role() != null
                    ? UserMapper.mapRoleToDm(filter.role()).getKeycloakName()
                    : null,
                filter.searchTerm()));
    return roleMembers.users();
  }

  public List<KeycloakApiUserDto> getUsers(UserRoleDto role) {
    return keycloakUserApi
        .getRoleMembers(
            realmName,
            new GetRoleMembersRequest(UserMapper.mapRoleToDm(role).getKeycloakName(), null))
        .users();
  }

  public void updateClientServiceAccountUserRoles(Map<String, List<String>> clientIdToRoles) {
    Map<String, RoleRepresentation> roleByName = getRoleRepresentationsByName();

    clientIdToRoles
        .keySet()
        .forEach(
            clientId ->
                updateClientServiceAccountUserRoles(
                    clientId, clientIdToRoles.get(clientId), roleByName));
  }

  private void updateClientServiceAccountUserRoles(
      String clientId, List<String> configuredRoles, Map<String, RoleRepresentation> roleByName) {
    RoleScopeResource roleScopeResource = getRoleScopeResource(clientId);
    List<String> existingRoles =
        roleScopeResource.listAll().stream().map(RoleRepresentation::getName).toList();

    KeycloakDiffer<String> rolesDiffer = getStringDiffer(existingRoles, configuredRoles);
    roleScopeResource.remove(
        rolesDiffer.getElementsToDelete().stream().map(roleByName::get).toList());
    roleScopeResource.add(rolesDiffer.getElementsToAdd().stream().map(roleByName::get).toList());
  }

  public EmployeeUserKeys addUserKeys(EmployeeUserKeys userKeys) {
    UserResource selfUserResource = getSelfUser();
    UserRepresentation selfUserRepresentation = selfUserResource.toRepresentation();

    if (KeycloakUtil.getUserAttribute(
            selfUserRepresentation.getAttributes(), AUDIT_LOG_ENCRYPTED_PRIVATE_KEY.getKey())
        .isPresent()) {
      throw new AlreadyExistsException(
          "Audit Log Key for user %s already exists".formatted(getSelfUserId()));
    }

    KeycloakMapper.mapEmployeeUserKeysIntoUserRepresentation(userKeys, selfUserRepresentation);
    selfUserResource.update(selfUserRepresentation);

    return KeycloakMapper.mapUserRepresentationToEmployeeUserKeys(selfUserRepresentation);
  }

  public static boolean containsEmployeeUserKey(UserRepresentation user) {
    return containsEmployeeUserKey(user.getAttributes());
  }

  public static boolean containsEmployeeUserKey(KeycloakApiUserDto user) {
    return containsEmployeeUserKey(user.attributes());
  }

  public static boolean containsEmployeeUserKey(Map<String, List<String>> attributes) {
    return KeycloakUtil.getUserAttribute(attributes, AUDIT_LOG_ENCRYPTED_PRIVATE_KEY.getKey())
        .isPresent();
  }
}
