/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.user.api.*;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.*;

@HttpExchange(UserApi.BASE_URL)
public interface UserApi {
  String BASE_URL = BaseUrls.Base.USER_API;
  String BULK_GET = BaseUrls.Base.BULK_GET_URL_END;
  String KEYS_URL = BaseUrls.Base.USER_KEYS_URL;
  String PUBLIC_KEYS_URL = BaseUrls.Base.USER_PUBLIC_KEYS_URL;
  String SELF_URL = BaseUrls.Base.USER_SELF_URL;
  String USER_SELF_CHAT_URL = BaseUrls.Base.USER_SELF_CHAT_ATTRIBUTES_URL;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Search users. Filter results by the parameters 'role' and 'search term'. At least one of these filter parameters must be provided")
  GetUsersResponse getUsers(
      @InlineParameterObject @ParameterObject @Valid UserFilterParameters parameters);

  @PostExchange(BULK_GET)
  @Operation(summary = "Get multiple users")
  GetUsersResponse getUsersBulk(@Valid @RequestBody GetUsersRequest userIds);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a user")
  UserDto getUser(@Parameter(description = "The id of the user") @PathVariable("id") UUID userId);

  @GetExchange("/{id}/profile")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the profile of a user, includes additional information")
  UserProfileDto getUserProfile(
      @Parameter(description = "The id of the user") @PathVariable(name = "id") UUID userId);

  @GetExchange("/groupMembers")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get users by groupName. Returns max. 100 entries.")
  GetUsersResponse getUsersByGroup(
      @Parameter(
              description = "The name of the group whose users shall be returned",
              example = "group")
          @RequestParam(name = "groupName")
          String groupName);

  @GetExchange("/user-management-page")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get resources for the user management page. Includes the self user, self user groups, and members of those groups.")
  GetUserManagementPageResponse getUserManagementPage();

  @GetExchange(SELF_URL + "/with-access")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get the user which is currently active, including all roles assigned to this user")
  SelfUserDto getSelfUserAndAccess();

  @GetExchange(SELF_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the user which is currently active")
  UserDto getSelfUser();

  @PutExchange(SELF_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Update the user which is currently active")
  UserDto updateSelfUser(@Valid @RequestBody UpdateSelfUserRequest request);

  @GetExchange(USER_SELF_CHAT_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the user chat attributes which is currently active")
  UserChatAttributesDto getSelfUserChatAttributes();

  @PutExchange(USER_SELF_CHAT_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Update user chat attributes which is currently active")
  UserChatAttributesDto updateSelfUserChatAttributes(
      @Valid @RequestBody UpdateSelfUserChatAttributesRequest request);

  @PostExchange(SELF_URL + KEYS_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Upload private and public key for an employee user (i.e. for audit log access)")
  EmployeeUserKeysDto addEmployeeSelfUserKeys(
      @Valid @RequestBody EmployeeUserKeysDto employeeUserKeys);

  @GetExchange(KEYS_URL + PUBLIC_KEYS_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Get the public keys from all employee users which have the right to decrypt
  log files from the audit log
  """)
  GetPublicEmployeeUserKeysResponse getPublicEmployeeUserKeys();

  @GetExchange(SELF_URL + KEYS_URL + "/private")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the private keys (necessary for decrypting audit log files) from the employee user who is currently active")
  PrivateEmployeeUserKeyDto getEmployeePrivateUserKey();

  @DeleteExchange(SELF_URL + KEYS_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Delete the key pair (used for audit log access) from the user which is currently active")
  void deleteEmployeeUserKeys();

  @GetExchange(SELF_URL + "/groups")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the groups of the currently active user")
  GetGroupsResponse getSelfGroups();

  @GetExchange(SELF_URL + "/leaders")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the team leaders of the currently active user")
  GetUsersResponse getSelfLeaders();

  @GetExchange(SELF_URL + "/active-sessions")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get all known active sessions for the currently active user")
  GetActiveSessionsResponse getSelfActiveSessions();

  @PostExchange(SELF_URL + "/active-sessions/invalidate")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Invalidates the provided sessions of the currently active user")
  void invalidateActiveSessions(@Valid @RequestBody InvalidateSessionsRequest request);

  @GetExchange(SELF_URL + "/events")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get logged events like login and login error of the currently active user")
  GetEventsResponse getSelfEvents(
      @InlineParameterObject @ParameterObject @Valid UserEventFilterParameters parameters);

  @PostExchange("/suggest")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Suggest a new user for the employee portal")
  UserDto suggestUser(@Valid @RequestBody AddUserRequest request);
}
