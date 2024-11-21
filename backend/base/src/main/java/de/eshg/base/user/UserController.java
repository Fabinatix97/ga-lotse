/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.CalendarEventService;
import de.eshg.base.calendar.CalendarService;
import de.eshg.base.calendar.api.GetEventsOfCalendarResponse;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.keycloak.EmployeeKeycloakClient;
import de.eshg.base.keycloak.EmployeeUserAttribute;
import de.eshg.base.keycloak.KeycloakEventType;
import de.eshg.base.user.api.*;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.lib.keycloak.AdministrativeGroup;
import de.eshg.lib.keycloak.ModuleLeaderGroup;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.notification.SimpleNotificationService;
import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "User")
public class UserController implements UserApi {

  private final UserService userService;
  private final CalendarService calendarService;
  private final CalendarEventService calendarEventService;
  private final SimpleNotificationService notificationService;
  private final Clock clock;
  private final BaseFeatureToggle featureToggle;

  public UserController(
      UserService userService,
      CalendarService calendarService,
      CalendarEventService calendarEventService,
      SimpleNotificationService notificationService,
      BaseFeatureToggle featureToggle,
      Clock clock) {
    this.userService = userService;
    this.calendarService = calendarService;
    this.calendarEventService = calendarEventService;
    this.notificationService = notificationService;
    this.clock = clock;
    this.featureToggle = featureToggle;
  }

  @Override
  public GetUsersResponse getUsers(UserFilterParameters parameters) {
    if (parameters.role() == null && StringUtils.isBlank(parameters.searchTerm())) {
      throw new BadRequestException("Either role or searchTerm must be set but both were empty");
    }

    return new GetUsersResponse(userService.getUsers(parameters));
  }

  @Override
  public GetUsersResponse getUsersBulk(GetUsersRequest request) {
    return new GetUsersResponse(
        userService.getUsers(request.userIds(), request.ignoreUnknownId() == Boolean.TRUE));
  }

  @Override
  public UserDto getUser(UUID userId) {
    return UserMapper.mapUserToApi(userService.getUserByIdOrThrow(userId));
  }

  @Override
  public UserProfileDto getUserProfile(UUID id) {
    ZonedDateTime startOfToday = ZonedDateTime.now(clock).truncatedTo(ChronoUnit.DAYS);
    ZonedDateTime endOfToday = startOfToday.plusHours(24).minusNanos(1);
    ZonedDateTime nextMonth = endOfToday.plusMonths(1);

    UserCalendar calendarReference = calendarService.getUserCalendar(id);
    GetEventsOfCalendarResponse calendarResponse =
        calendarEventService.getDetailedEventsOfCalendar(
            calendarReference.calendarId(), startOfToday.toInstant(), nextMonth.toInstant());

    return UserMapper.mapUserProfileToApi(
        userService.getUserByIdOrThrow(id),
        userService.getUserGroups(id),
        calendarResponse.events());
  }

  @Override
  public GetUsersResponse getUsersByGroup(String groupName) {
    return new GetUsersResponse(
        userService.getUsersByGroup(groupName).stream().map(UserMapper::mapUserToApi).toList());
  }

  @Override
  public GetUserManagementPageResponse getUserManagementPage() {
    UserRepresentation selfUser = userService.getSelfUser();
    List<String> selfGroups = userService.getUserKeycloakGroups();
    List<GroupMemberDto> groupMembers =
        userService.getGroupMembers(selfGroups).stream()
            .map(UserMapper::mapGroupMemberToApi)
            .toList();

    return new GetUserManagementPageResponse(
        UserMapper.mapUserToApi(selfUser),
        selfGroups.stream().sorted().map(UserGroupDto::new).toList(),
        groupMembers);
  }

  @Override
  public UserDto getSelfUser() {
    return UserMapper.mapUserToApi(userService.getSelfUser());
  }

  @Override
  public UserDto updateSelfUser(UpdateSelfUserRequest request) {
    UserRepresentation updated =
        userService.updateUser(
            EmployeeKeycloakClient.getSelfUserId(),
            user -> {
              Map<String, List<String>> currentAttributes =
                  Objects.requireNonNullElseGet(user.getAttributes(), LinkedHashMap::new);
              Map<String, List<String>> attributes =
                  UserMapper.mapAttributesToDm(
                      currentAttributes,
                      request.phoneNumber(),
                      request.externalChatUsername(),
                      request.title(),
                      request.salutation());
              user.setAttributes(attributes);
            });
    return UserMapper.mapUserToApi(updated);
  }

  @Override
  public EmployeeUserKeysDto addEmployeeSelfUserKeys(EmployeeUserKeysDto employeeUserKeys) {
    return UserMapper.mapUserKeysToApi(
        userService.addEmployeeUserKeys(UserMapper.mapUserKeysToDm(employeeUserKeys)));
  }

  @Override
  public GetPublicEmployeeUserKeysResponse getPublicEmployeeUserKeys() {
    List<PublicEmployeeUserKeyDto> publicUserKeys =
        userService.getAllPublicEmployeeUserKeys().stream()
            .map(UserMapper::mapPublicUserKeysToApi)
            .toList();
    return new GetPublicEmployeeUserKeysResponse(publicUserKeys);
  }

  @Override
  public PrivateEmployeeUserKeyDto getEmployeePrivateUserKey() {
    return UserMapper.mapPrivateUserKeyToApi(userService.getPrivateEmployeeUserKey());
  }

  @Override
  public void deleteEmployeeUserKeys() {
    userService.deleteEmployeeUserKeys();
  }

  @Override
  public GetPermissionsResponse getSelfUserPermissions() {
    List<UserRoleDto> roles =
        userService.getUserKeycloakRoles().stream()
            .map(UserMapper::mapKeycloakRoleToApi)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .sorted()
            .toList();
    return new GetPermissionsResponse(roles);
  }

  @Override
  public GetGroupsResponse getSelfGroups() {
    return new GetGroupsResponse(
        userService.getUserKeycloakGroups().stream().map(UserGroupDto::new).toList());
  }

  @Override
  public GetUsersResponse getSelfLeaders() {
    Set<ModuleLeaderGroup> relevantModuleLeaderGroups =
        userService.getUserKeycloakGroups().stream()
            .map(ModuleMemberGroup::fromValueGracefullyOrNull)
            .filter(Objects::nonNull)
            .map(ModuleLeaderGroup::forModuleMemberGroup)
            .collect(StreamUtil.toLinkedHashSet());

    return new GetUsersResponse(
        userService.getTeamLeadersByGroups(relevantModuleLeaderGroups).stream()
            .map(UserMapper::mapUserToApi)
            .toList());
  }

  @Override
  public GetActiveSessionsResponse getSelfActiveSessions() {
    String sessionId = CurrentUserHelper.getCurrentUserSessionIdGracefully().orElse("");
    return new GetActiveSessionsResponse(
        userService.getSelfActiveSessions().sessions().stream()
            .map(
                session ->
                    new ActiveUserSession(
                        UUID.fromString(session.sessionId()),
                        session.ip(),
                        Instant.ofEpochSecond(session.startTime()),
                        Instant.ofEpochSecond(session.lastActiveTime()),
                        sessionId.equals(session.sessionId()),
                        new ActiveUserSession.Device(
                            session.device().deviceName(),
                            session.device().browserName(),
                            session.device().osName(),
                            session.device().osVersion(),
                            session.device().isMobile())))
            .toList());
  }

  @Override
  public void invalidateActiveSessions(InvalidateSessionsRequest request) {
    userService.invalidateSessions(request.sessions());
  }

  @Override
  public GetEventsResponse getSelfEvents(UserEventFilterParameters parameters) {
    int offset = parameters.offset();
    int limit = parameters.limit();
    Set<KeycloakEventType> eventTypes = getEventTypeOrFallback(parameters.type());

    UserRepresentation selfUser = userService.getSelfUser();
    List<EventRepresentation> userEvents =
        userService.getUserEvents(selfUser, offset, limit + 1, eventTypes);
    boolean hasNext = userEvents.size() > limit;
    return new GetEventsResponse(
        userEvents.stream().limit(limit).map(UserMapper::mapEventToApi).toList(), hasNext);
  }

  private static Set<KeycloakEventType> getEventTypeOrFallback(UserEventTypeDto type) {
    return type != null
        ? Set.of(UserMapper.mapToDm(type))
        : Set.of(KeycloakEventType.LOGIN_ERROR, KeycloakEventType.LOGIN);
  }

  @Override
  public UserDto suggestUser(AddUserRequest request) {
    UserRepresentation user = UserMapper.mapUserToDm(request);
    user.setEnabled(false);

    UserRepresentation self = userService.getSelfUser();
    String suggestedBy =
        "%s %s (%s)".formatted(self.getFirstName(), self.getLastName(), self.getId());
    user.getAttributes().put(EmployeeUserAttribute.SUGGESTED_BY.getKey(), List.of(suggestedBy));

    UserDto suggestedUser = userService.addUser(user);

    List<UserRepresentation> sysAdminUsers =
        userService.getUsersByGroup(AdministrativeGroup.USER_ADMINISTRATOR.getKeycloakName());
    sysAdminUsers.forEach(sysAdmin -> createNotification(sysAdmin.getId(), suggestedUser));

    return suggestedUser;
  }

  private void createNotification(String sysAdminId, UserDto suggestedUser) {
    notificationService.addNotification(
        new SimpleNotification(
            UUID.fromString(sysAdminId),
            "Benutzerverwaltung: Neuer Accountvorschlag",
            "Bitte in Keycloak ablehnen oder bestätigen: Ein neuer Benutzer mit der Mailadresse %s soll hinzugefügt werden."
                .formatted(suggestedUser.email())));
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<String> onKeycloakNotFound(NotFoundException exception) {
    return new ResponseEntity<>(
        exception.getResponse().readEntity(String.class), HttpStatus.NOT_FOUND);
  }
}
