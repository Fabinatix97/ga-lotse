/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.providers;

import de.eshg.keycloak.api.user.model.BulkGetUsersRequest;
import de.eshg.keycloak.api.user.model.CredentialRequest;
import de.eshg.keycloak.api.user.model.CredentialType;
import de.eshg.keycloak.api.user.model.GetActiveSessionResponse;
import de.eshg.keycloak.api.user.model.GetGroupMembersRequest;
import de.eshg.keycloak.api.user.model.GetGroupMembersResponse;
import de.eshg.keycloak.api.user.model.GetRoleMembersRequest;
import de.eshg.keycloak.api.user.model.GetRoleMembersResponse;
import de.eshg.keycloak.api.user.model.GetUsersResponse;
import de.eshg.keycloak.api.user.model.KeycloakApiActiveUserSession;
import de.eshg.keycloak.api.user.model.KeycloakApiGroupMemberDto;
import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import de.eshg.keycloak.mappers.KeycloakMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
import java.util.stream.Stream;
import org.eclipse.microprofile.openapi.annotations.extensions.Extension;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.jboss.resteasy.reactive.NoCache;
import org.keycloak.credential.CredentialInput;
import org.keycloak.device.DeviceActivityManager;
import org.keycloak.models.*;
import org.keycloak.models.utils.ModelToRepresentation;
import org.keycloak.representations.account.DeviceRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.services.resources.KeycloakOpenAPI;
import org.keycloak.services.resources.admin.permissions.AdminPermissionEvaluator;

@Extension(name = KeycloakOpenAPI.Profiles.ADMIN, value = "")
public class ExtendedUserResource {
  public static final Comparator<UserModel> SORT_BY_USERNAME =
      Comparator.comparing(UserModel::getUsername);
  private final KeycloakSession session;
  private final RealmModel realm;
  private final AdminPermissionEvaluator auth;

  ExtendedUserResource(KeycloakSession session, RealmModel realm, AdminPermissionEvaluator auth) {
    this.session = session;
    this.realm = realm;
    this.auth = auth;
  }

  @POST
  @NoCache
  @Path("/bulk-get")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public GetUsersResponse getUsersBulk(@Valid @NotNull @RequestBody BulkGetUsersRequest request) {
    auth.users().requireQuery();

    UserProvider userProvider = session.users();
    List<KeycloakApiUserDto> users =
        request.userIds().stream()
            .map(UUID::toString)
            .map(id -> getUserByIdOrThrow(userProvider, id, request.ignoreUnknownId()))
            .filter(Objects::nonNull)
            .map(this::getRepresentation)
            .map(KeycloakMapper::mapUserToApi)
            .toList();
    return new GetUsersResponse(users);
  }

  @POST
  @NoCache
  @Path("/search-users")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public GetGroupMembersResponse getGroupMembers(
      @Valid @NotNull @RequestBody GetGroupMembersRequest request) {
    auth.users().requireQuery();

    UserProvider userProvider = session.users();
    Set<String> groups = request.groupNames() == null ? null : new HashSet<>(request.groupNames());

    List<KeycloakApiGroupMemberDto> users =
        getAllUserStream(userProvider, null)
            .filter(
                user ->
                    groups == null
                        || user.getGroupsStream()
                            .map(GroupModel::getName)
                            .anyMatch(groups::contains))
            .sorted(SORT_BY_USERNAME)
            .map(
                user -> {
                  List<String> groupNames =
                      user.getGroupsStream().map(GroupModel::getName).sorted().toList();
                  KeycloakApiUserDto userDto =
                      KeycloakMapper.mapUserToApi(this.getRepresentation(user));
                  return new KeycloakApiGroupMemberDto(groupNames, userDto);
                })
            .toList();

    return new GetGroupMembersResponse(users);
  }

  @POST
  @NoCache
  @Path("/role-members")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public GetRoleMembersResponse getRoleMembers(
      @Valid @NotNull @RequestBody GetRoleMembersRequest request) {
    auth.users().requireQuery();

    UserProvider userProvider = session.users();
    RoleProvider roleProvider = session.roles();
    RoleModel role =
        request.roleName() != null ? roleProvider.getRealmRole(realm, request.roleName()) : null;

    List<KeycloakApiUserDto> roleMembers =
        getAllUserStream(userProvider, request.searchTerm())
            .filter(user -> role == null || user.hasRole(role))
            .sorted(SORT_BY_USERNAME)
            .map(this::getRepresentation)
            .map(KeycloakMapper::mapUserToApi)
            .toList();

    return new GetRoleMembersResponse(roleMembers);
  }

  private Stream<UserModel> getAllUserStream(UserProvider userProvider, String searchTerm) {
    Map<String, String> params = new HashMap<>();
    params.put(UserModel.INCLUDE_SERVICE_ACCOUNT, "false");
    if (searchTerm != null) {
      params.put(UserModel.SEARCH, searchTerm);
    }
    return userProvider
        .searchForUserStream(realm, params)
        .filter(user -> user.getServiceAccountClientLink() == null);
  }

  @GET
  @NoCache
  @Path("/users/{id}/active-sessions")
  @Produces(MediaType.APPLICATION_JSON)
  public GetActiveSessionResponse getActiveUserSessions(@PathParam("id") String id) {
    auth.users().requireView();
    UserModel user = session.users().getUserById(realm, id);
    return new GetActiveSessionResponse(
        session
            .sessions()
            .getUserSessionsStream(realm, user)
            .map(this::getSessionRepresentation)
            .toList());
  }

  @POST
  @NoCache
  @Path("/users/{id}/verify-credential")
  @Consumes(MediaType.APPLICATION_JSON)
  public void verifyCredential(
      @PathParam("id") String id, @Valid @RequestBody CredentialRequest request) {
    auth.users().requireQuery();
    validateCredentialType(request);

    UserModel user = getUserByIdOrThrow(session.users(), id, false);
    CredentialInput credentialInput =
        new UserCredentialModel(null, request.type().getName(), request.rawSecret(), true);
    if (!user.credentialManager().isValid(credentialInput)) {
      throw new NotAuthorizedException("Invalid credential");
    }
  }

  @PUT
  @NoCache
  @Path("/users/{id}/reset-credential")
  @Consumes(MediaType.APPLICATION_JSON)
  public void resetCredential(
      @PathParam("id") String id, @Valid @RequestBody CredentialRequest request) {
    auth.users().requireManage();
    validateCredentialType(request);

    UserModel user = getUserByIdOrThrow(session.users(), id, false);
    CredentialInput credentialInput =
        new UserCredentialModel(null, request.type().getName(), request.rawSecret(), true);
    user.credentialManager().updateCredential(credentialInput);
  }

  private void validateCredentialType(CredentialRequest request) {
    List<CredentialType> manageableCredentials = List.of(CredentialType.PIN, CredentialType.DOB);
    if (!manageableCredentials.contains(request.type())) {
      throw new NotAuthorizedException("Credential type cannot be managed by this endpoint");
    }
  }

  private UserRepresentation getRepresentation(UserModel user) {
    return ModelToRepresentation.toRepresentation(session, realm, user);
  }

  private KeycloakApiActiveUserSession getSessionRepresentation(UserSessionModel sessionModel) {
    DeviceRepresentation device = DeviceActivityManager.getCurrentDevice(sessionModel);

    return new KeycloakApiActiveUserSession(
        sessionModel.getId(),
        sessionModel.getIpAddress(),
        sessionModel.getStarted(),
        sessionModel.getLastSessionRefresh(),
        new KeycloakApiActiveUserSession.Device(
            nullIfOther(device.getDevice()),
            nullIfOther(device.getBrowser()),
            nullIfOther(device.getOs()),
            getOsVersionOrNull(device),
            device.isMobile()));
  }

  private static String nullIfOther(String value) {
    return value.startsWith("Other") ? null : value;
  }

  private static String getOsVersionOrNull(DeviceRepresentation device) {
    return DeviceRepresentation.UNKNOWN.equals(device.getOsVersion())
        ? null
        : device.getOsVersion();
  }

  private UserModel getUserByIdOrThrow(
      UserProvider userProvider, String id, boolean ignoreUnknownId) {
    UserModel user = userProvider.getUserById(realm, id);
    if (user == null && !ignoreUnknownId) {
      throw new NotFoundException("User with id '%s' not found".formatted(id));
    }
    return user;
  }
}
