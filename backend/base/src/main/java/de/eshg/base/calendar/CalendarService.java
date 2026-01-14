/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.api.AddGlobalCalendarRequest;
import de.eshg.base.calendar.api.CalendarDto;
import de.eshg.base.calendar.api.CalendarTypeDto;
import de.eshg.base.calendar.api.GetCalendarsResponse;
import de.eshg.base.calendar.api.GetRelevantCalendarsResponse;
import de.eshg.base.calendar.api.GetResourceCalendarsResponse;
import de.eshg.base.calendar.api.GetUserCalendarsResponse;
import de.eshg.base.calendar.api.GlobalCalendar;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.calendar.api.UserGroupCalendarInfo;
import de.eshg.base.calendar.mapper.CalendarMapper;
import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import de.eshg.base.calendar.persistence.repository.CalendarRepository;
import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.keycloak.api.user.model.KeycloakApiGroupMemberDto;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CalendarService {
  private final CalendarRepository calendarRepository;
  private final UserService userService;

  public CalendarService(CalendarRepository calendarRepository, UserService userService) {
    this.calendarRepository = calendarRepository;
    this.userService = userService;
  }

  @Transactional
  public GlobalCalendar addGlobalCalendar(AddGlobalCalendarRequest request) {
    Calendar savedCalendar = calendarRepository.save(CalendarMapper.mapToDomain(request));
    return CalendarMapper.mapToGlobalCalendarResponse(savedCalendar);
  }

  @Transactional
  public Calendar addResourceCalendar(UUID resourceId) {
    Calendar calendar = new Calendar();
    calendar.setType(CalendarType.RESOURCE);
    calendar.setResourceId(resourceId);
    return calendarRepository.save(calendar);
  }

  @Transactional(readOnly = true)
  public ResourceCalendar getResourceCalendar(UUID resourceId) {
    Calendar calendar =
        calendarRepository
            .findByResourceId(resourceId)
            .orElseThrow(() -> new NotFoundException("Calendar with given resource id not found"));
    return CalendarMapper.mapToResourceCalendar(calendar);
  }

  @Transactional(readOnly = true)
  public GetResourceCalendarsResponse getResourceCalendars(List<UUID> resourceIds) {
    List<Calendar> existingResourceCalendars =
        calendarRepository.findAllByResourceIdInOrderById(resourceIds);
    List<UUID> notExistingResourceIds =
        extractNotExistingIds(resourceIds, existingResourceCalendars, Calendar::getResourceId);

    return new GetResourceCalendarsResponse(
        existingResourceCalendars.stream().map(CalendarMapper::mapToResourceCalendar).toList(),
        notExistingResourceIds);
  }

  @Transactional
  public UserCalendar getCurrentUserCalendar() {
    UUID userId = CurrentUserHelper.getCurrentUserId();
    return getUserCalendarInternal(userId);
  }

  @Transactional
  public UserCalendar getUserCalendar(UUID userId) {
    return getUserCalendarInternal(userId);
  }

  private UserCalendar getUserCalendarInternal(UUID userId) {
    Calendar calendar =
        calendarRepository.findByUserId(userId).orElseGet(() -> addUserCalendar(userId));
    return CalendarMapper.mapToUserCalendar(calendar);
  }

  private Calendar addUserCalendar(UUID userId) {
    userService.getUserByIdOrThrow(userId);
    return calendarRepository.save(CalendarMapper.mapToDomain(userId));
  }

  @Transactional(readOnly = true)
  public GetCalendarsResponse getCalendars(boolean onlyGlobal) {
    List<Calendar> calendars;
    if (onlyGlobal) {
      calendars = calendarRepository.findAllByTypeOrderById(CalendarType.GLOBAL);
    } else {
      calendars = calendarRepository.findAllByOrderById();
    }

    List<CalendarDto> calendarTypeDtos =
        calendars.stream().map(CalendarMapper::mapCalendarToApi).collect(Collectors.toList());

    calendarTypeDtos.add(
        new CalendarDto(
            RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID,
            CalendarTypeDto.GLOBAL,
            RegionalHolidayCalendar.HOLIDAY_CALENDAR_NAME,
            null,
            null));

    return new GetCalendarsResponse(calendarTypeDtos);
  }

  @Transactional
  public GetUserCalendarsResponse getUserCalendars(List<UUID> userIds) {
    List<UserDto> users = userService.getUsers(userIds, true);
    List<UUID> notFoundUserIds = extractNotExistingIds(userIds, users, UserDto::userId);
    userIds.removeAll(notFoundUserIds);
    List<Calendar> userCalendars = retrieveUserCalendarsAndCreateIfNecessary(userIds);
    return new GetUserCalendarsResponse(
        userCalendars.stream().map(CalendarMapper::mapToUserCalendar).toList(), notFoundUserIds);
  }

  private static <T> List<UUID> extractNotExistingIds(
      Collection<UUID> allIds, List<T> existingEntities, Function<T, UUID> idExtractor) {
    List<UUID> notExistingIds = new ArrayList<>(allIds);
    notExistingIds.removeAll(existingEntities.stream().map(idExtractor).toList());
    return notExistingIds;
  }

  private List<Calendar> retrieveUserCalendarsAndCreateIfNecessary(Collection<UUID> userIds) {
    List<Calendar> calendars = calendarRepository.findAllByUserIdIn(userIds);
    List<UUID> idsWithoutCalendar = extractNotExistingIds(userIds, calendars, Calendar::getUserId);
    calendars.addAll(addUserCalendars(idsWithoutCalendar));
    calendars.sort(Comparator.comparing(Calendar::getId));
    return calendars;
  }

  private List<Calendar> addUserCalendars(List<UUID> userIds) {
    return calendarRepository.saveAll(userIds.stream().map(CalendarMapper::mapToDomain).toList());
  }

  @Transactional
  public GetRelevantCalendarsResponse getRelevantCalendars(UserCalendar currentUserCalendar) {
    List<GlobalCalendar> globalCalendars = getGlobalCalendars();

    Map<String, List<UserDto>> groupsToUsers =
        getGroupsToUsersWithoutSelf(currentUserCalendar.userId());
    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(groupsToUsers);
    List<UserGroupCalendarInfo> userGroupCalendarInfos =
        getUserGroupCalendarInfos(resolvedUsers.keySet(), groupsToUsers);

    return new GetRelevantCalendarsResponse(
        currentUserCalendar, globalCalendars, userGroupCalendarInfos, resolvedUsers);
  }

  private List<GlobalCalendar> getGlobalCalendars() {
    return Stream.concat(
            calendarRepository.findAllByTypeOrderById(CalendarType.GLOBAL).stream()
                .map(
                    calendar ->
                        new GlobalCalendar(
                            calendar.getExternalId(), calendar.getGlobalCalendarName())),
            Stream.of(
                new GlobalCalendar(
                    RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID,
                    RegionalHolidayCalendar.HOLIDAY_CALENDAR_NAME)))
        .toList();
  }

  private Map<String, List<UserDto>> getGroupsToUsersWithoutSelf(UUID currentUserId) {
    List<String> groupNames = userService.getUserKeycloakGroups();
    List<KeycloakApiGroupMemberDto> groupMembers = userService.getGroupMembers(groupNames);

    Map<String, List<UserDto>> groupToUsers = new HashMap<>();
    groupNames.forEach(
        groupName -> {
          List<UserDto> usersInGroup =
              groupMembers.stream()
                  .filter(
                      groupMember ->
                          !groupMember.user().id().equals(currentUserId)
                              && groupMember.groupNames().contains(groupName))
                  .map(groupMember -> UserMapper.mapUserToApi(groupMember.user()))
                  .toList();
          groupToUsers.put(groupName, usersInGroup);
        });

    return groupToUsers;
  }

  private static Map<UUID, UserDto> getResolvedUsers(Map<String, List<UserDto>> groupsToUsers) {
    return groupsToUsers.values().stream()
        .flatMap(Collection::stream)
        .collect(
            Collectors.toMap(
                UserDto::userId, Function.identity(), (first, second) -> first, TreeMap::new));
  }

  private List<UserGroupCalendarInfo> getUserGroupCalendarInfos(
      Set<UUID> userIds, Map<String, List<UserDto>> groupsToUsers) {
    Map<UUID, Calendar> userIdToCalendar =
        retrieveUserCalendarsAndCreateIfNecessary(userIds).stream()
            .collect(StreamUtil.toLinkedHashMap(Calendar::getUserId));
    return groupsToUsers.entrySet().stream()
        .map(entry -> getUserGroupCalendarInfo(entry.getKey(), entry.getValue(), userIdToCalendar))
        .filter(userGroupCalendarInfo -> !userGroupCalendarInfo.userCalendars().isEmpty())
        .sorted(Comparator.comparing(UserGroupCalendarInfo::groupName))
        .toList();
  }

  private UserGroupCalendarInfo getUserGroupCalendarInfo(
      String groupName, List<UserDto> users, Map<UUID, Calendar> userIdToCalendar) {
    List<UserCalendar> userCalendars =
        users.stream()
            .map(userDto -> userIdToCalendar.get(userDto.userId()))
            .filter(Objects::nonNull)
            .map(calendar -> new UserCalendar(calendar.getExternalId(), calendar.getUserId()))
            .sorted(Comparator.comparing(UserCalendar::userId))
            .toList();

    return new UserGroupCalendarInfo(groupName, userCalendars);
  }
}
