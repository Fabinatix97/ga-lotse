/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import static de.eshg.rest.service.security.CurrentUserHelper.currentUserHasNoRole;
import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import de.eshg.base.calendar.api.BaseEventRequest;
import de.eshg.base.calendar.api.BaseEventTypeDto;
import de.eshg.base.calendar.api.BlockingEventsOfCalendar;
import de.eshg.base.calendar.api.BlockingEventsOfResource;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsResponse;
import de.eshg.base.calendar.api.GetBlockingEventsOfResourcesResponse;
import de.eshg.base.calendar.api.GetBusinessCaseEventResponse;
import de.eshg.base.calendar.api.GetEventsOfCalendarResponse;
import de.eshg.base.calendar.api.GetEventsWithTimeDataResponse;
import de.eshg.base.calendar.api.GetResourceCalendarsResponse;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.calendar.mapper.CalendarData;
import de.eshg.base.calendar.mapper.CalendarEventData;
import de.eshg.base.calendar.mapper.CalendarEventMapper;
import de.eshg.base.calendar.persistence.CalendarEventDomainModelHandler;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import de.eshg.base.calendar.persistence.entity.EventType;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CalendarEventService {
  private static final int MAXIMUM_DAYS = 45;

  private final CalendarEventDomainModelHandler calendarEventDomainModelHandler;
  private final CalendarService calendarService;

  private final RegionalHolidayCalendar regionalHolidayCalendar;

  private final BusinessModuleEventAugmentation businessModuleEventAugmentation;

  public CalendarEventService(
      CalendarEventDomainModelHandler calendarEventDomainModelHandler,
      CalendarService calendarService,
      RegionalHolidayCalendar regionalHolidayCalendar,
      BusinessModuleEventAugmentation businessModuleEventAugmentation) {
    this.calendarEventDomainModelHandler = calendarEventDomainModelHandler;
    this.calendarService = calendarService;
    this.regionalHolidayCalendar = regionalHolidayCalendar;
    this.businessModuleEventAugmentation = businessModuleEventAugmentation;
  }

  private <T> T doWithResourceCalendarLocks(
      List<CalendarData> calendarDatas, Supplier<T> supplier) {
    List<UUID> resourceCalendarExternalIds =
        calendarDatas.stream()
            .filter(calendar -> calendar.getType().equals(CalendarType.RESOURCE))
            .map(CalendarData::getExternalId)
            .toList();
    if (resourceCalendarExternalIds.isEmpty()) {
      return supplier.get();
    }

    Instant now = Instant.now();
    calendarEventDomainModelHandler.deleteObsoleteMutexes(resourceCalendarExternalIds, now);

    try {
      calendarEventDomainModelHandler.saveNewMutexes(resourceCalendarExternalIds);
    } catch (DataIntegrityViolationException | ObjectOptimisticLockingFailureException e) {
      String message = "A resource calendar is currently locked";
      throw new BadRequestException(ErrorCode.CONFLICT, message);
    }

    try {
      return supplier.get();
    } finally {
      calendarEventDomainModelHandler.deleteMutexes(resourceCalendarExternalIds);
    }
  }

  public DetailedEvent addBaseEvent(BaseEventRequest request) {
    List<CalendarData> calendarDatas = validateCalendarsExist(List.of(request.calendarId()));
    CalendarData calendarData = calendarDatas.getFirst();
    validatePermissionForBaseEventChange(calendarData);
    validateStartBeforeEnd(request.timeData().start(), request.timeData().end());
    validateEventTypeFitsToCalendarType(calendarData.getType(), request.type());
    validateNoSubjectForUserCalendar(calendarData.getType(), request.subject());

    return doWithResourceCalendarLocks(
        calendarDatas,
        () -> {
          validateNoConflictInResourceCalendars(
              calendarDatas, request.timeData().start(), request.timeData().end(), null);

          CalendarEventData calendarEventData =
              calendarEventDomainModelHandler.saveNewEvent(
                  request, calendarDatas, getCurrentUserId());
          return CalendarEventMapper.mapToDetailedEvent(
              calendarEventData, isMapResponseWithSubject(calendarData));
        });
  }

  public DetailedEvent updateBaseEvent(UUID eventExternalId, BaseEventRequest request) {
    List<CalendarData> calendarDatas = validateCalendarsExist(List.of(request.calendarId()));
    CalendarData calendarData = calendarDatas.getFirst();
    validatePermissionForBaseEventChange(calendarData);
    CalendarEventData eventToUpdate = validateBaseEventExists(eventExternalId);
    validatePermissionForBaseEventChange(eventToUpdate.getCalendars().iterator().next());
    validateStartBeforeEnd(request.timeData().start(), request.timeData().end());
    validateEventTypeFitsToCalendarType(calendarData.getType(), request.type());
    validateNoSubjectForUserCalendar(calendarData.getType(), request.subject());

    return doWithResourceCalendarLocks(
        calendarDatas,
        () -> {
          validateNoConflictInResourceCalendars(
              calendarDatas,
              request.timeData().start(),
              request.timeData().end(),
              eventToUpdate.getExternalId());

          CalendarEventData calendarEventData =
              calendarEventDomainModelHandler.updateEvent(
                  eventToUpdate.getExternalId(), request, calendarDatas, getCurrentUserId());
          return CalendarEventMapper.mapToDetailedEvent(
              calendarEventData, isMapResponseWithSubject(calendarData));
        });
  }

  public DetailedEvent getBaseEvent(UUID eventExternalId) {
    CalendarEventData calendarEventData = validateBaseEventExists(eventExternalId);
    CalendarData calendarData = calendarEventData.getCalendars().iterator().next();

    return CalendarEventMapper.mapToDetailedEvent(
        calendarEventData, isMapResponseWithSubject(calendarData));
  }

  public void deleteBaseEvent(UUID eventExternalId) {
    CalendarEventData calendarEventData = validateBaseEventExists(eventExternalId);
    List<CalendarData> calendarDatas =
        validateCalendarsExist(
            calendarEventData.getCalendars().stream().map(CalendarData::getExternalId).toList());
    validatePermissionForBaseEventChange(calendarDatas.getFirst());

    calendarEventDomainModelHandler.deleteEvent(calendarEventData.getExternalId());
  }

  public DetailedEvent addBusinessCaseEvent(BusinessCaseEventRequest request) {
    validateStartBeforeEnd(request.timeData().start(), request.timeData().end());
    List<CalendarData> calendarDatas = validateCalendarsExist(request.calendarIds());
    validateNoGlobalCalendar(calendarDatas);

    return doWithResourceCalendarLocks(
        calendarDatas,
        () -> {
          validateNoConflictInResourceCalendars(
              calendarDatas, request.timeData().start(), request.timeData().end(), null);

          CalendarEventData calendarEventData =
              calendarEventDomainModelHandler.saveNewEvent(
                  request, calendarDatas, getCurrentUserId());
          return CalendarEventMapper.mapToDetailedEvent(calendarEventData, false);
        });
  }

  public DetailedEvent updateBusinessCaseEvent(
      UUID eventExternalId, BusinessCaseEventRequest request) {
    validateStartBeforeEnd(request.timeData().start(), request.timeData().end());
    CalendarEventData eventToUpdate = validateBusinessCaseEventExists(eventExternalId);
    List<CalendarData> calendarDatas = validateCalendarsExist(request.calendarIds());
    validateNoGlobalCalendar(calendarDatas);

    return doWithResourceCalendarLocks(
        calendarDatas,
        () -> {
          validateNoConflictInResourceCalendars(
              calendarDatas,
              request.timeData().start(),
              request.timeData().end(),
              eventToUpdate.getExternalId());

          CalendarEventData calendarEventData =
              calendarEventDomainModelHandler.updateEvent(
                  eventToUpdate.getExternalId(), request, calendarDatas, getCurrentUserId());
          return CalendarEventMapper.mapToDetailedEvent(calendarEventData, false);
        });
  }

  public GetBusinessCaseEventResponse getBusinessCaseEvent(UUID eventExternalId) {
    CalendarEventData calendarEventData = validateBusinessCaseEventExists(eventExternalId);

    DetailedEvent detailedEvent = CalendarEventMapper.mapToDetailedEvent(calendarEventData, false);

    return businessModuleEventAugmentation.augmentBusinessModuleEventsWithMetadata(
        (augmentedEvents, errorResponses) ->
            new GetBusinessCaseEventResponse(augmentedEvents.getFirst(), errorResponses),
        List.of(detailedEvent));
  }

  public void deleteBusinessCaseEvent(UUID eventExternalId) {
    CalendarEventData calendarEventData = validateBusinessCaseEventExists(eventExternalId);

    calendarEventDomainModelHandler.deleteEvent(calendarEventData.getExternalId());
  }

  public GetEventsOfCalendarResponse getDetailedEventsOfCalendar(
      UUID calendarExternalId, Instant timeRangeStart, Instant timeRangeEnd) {
    validateStartBeforeEnd(timeRangeStart, timeRangeEnd);
    validateMaximumTimeRange(timeRangeStart, timeRangeEnd);

    if (calendarExternalId.equals(RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID)) {
      return new GetEventsOfCalendarResponse(
          calendarExternalId,
          regionalHolidayCalendar.findByDateRangeAndCalendarId(timeRangeStart, timeRangeEnd),
          Collections.emptyList());
    }
    CalendarData calendarData = validateCalendarsExist(List.of(calendarExternalId)).getFirst();

    List<DetailedEventWithoutCalendarId> events =
        calendarEventDomainModelHandler
            .findEventsInCalendar(calendarExternalId, timeRangeStart, timeRangeEnd)
            .stream()
            .map(
                event ->
                    CalendarEventMapper.mapToDetailedEventWithoutCalendarId(
                        event, isMapResponseWithSubject(calendarData)))
            .toList();

    return businessModuleEventAugmentation.augmentBusinessModuleEventsWithMetadata(
        (augmentedEvents, errorResponses) ->
            new GetEventsOfCalendarResponse(calendarExternalId, augmentedEvents, errorResponses),
        events);
  }

  public GetBlockingEventsOfResourcesResponse findBusyEventsOfResourceCalendars(
      List<UUID> resourceIds, Instant timeRangeStart, Instant timeRangeEnd) {
    GetResourceCalendarsResponse resourceCalendarResponse =
        calendarService.getResourceCalendars(resourceIds);

    Map<UUID, UUID> calendarIdToResourceId =
        resourceCalendarResponse.resourceCalendars().stream()
            .collect(Collectors.toMap(ResourceCalendar::calendarId, ResourceCalendar::resourceId));

    List<BlockingEventsOfCalendar> blockingEventsOfCalendars;
    if (calendarIdToResourceId.isEmpty()) {
      blockingEventsOfCalendars = Collections.emptyList();
    } else {
      blockingEventsOfCalendars =
          findBusyEventsOfCalendars(
                  calendarIdToResourceId.keySet().stream().toList(),
                  List.of(new TimeRange(timeRangeStart, timeRangeEnd)))
              .calendarsWithBlockingEvents();
    }

    return new GetBlockingEventsOfResourcesResponse(
        blockingEventsOfCalendars.stream()
            .map(
                blockingEventsOfCalendar ->
                    new BlockingEventsOfResource(
                        calendarIdToResourceId.get(blockingEventsOfCalendar.calendarId()),
                        blockingEventsOfCalendar.events()))
            .toList(),
        resourceCalendarResponse.notFoundResourceIds());
  }

  public GetBlockingEventsOfCalendarsResponse findBusyEventsOfCalendars(
      List<UUID> calendarExternalIds, List<TimeRange> timeRanges) {
    timeRanges.forEach(
        timeRange -> {
          validateStartBeforeEnd(timeRange.start(), timeRange.end());
          validateMaximumTimeRange(timeRange.start(), timeRange.end());
        });

    List<BlockingEventsOfCalendar> blockingEventsOfCalendars = new ArrayList<>();
    List<UUID> relevantCalendarExternalIds = new ArrayList<>(calendarExternalIds);
    if (calendarExternalIds.contains(RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID)) {
      Map<UUID, DetailedEventWithoutCalendarId> id2Event =
          timeRanges.stream()
              .map(
                  timeRange ->
                      regionalHolidayCalendar.findByDateRangeAndCalendarId(
                          timeRange.start(), timeRange.end()))
              .flatMap(Collection::stream)
              .collect(
                  Collectors.toMap(
                      DetailedEventWithoutCalendarId::id,
                      Function.identity(),
                      (first, second) -> first));

      timeRanges.forEach(
          timeRange -> {
            List<DetailedEventWithoutCalendarId> events =
                regionalHolidayCalendar.findByDateRangeAndCalendarId(
                    timeRange.start(), timeRange.end());
            for (DetailedEventWithoutCalendarId event : events) {
              id2Event.put(event.id(), event);
            }
          });

      blockingEventsOfCalendars.add(
          new BlockingEventsOfCalendar(
              RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID,
              id2Event.values().stream()
                  .map(CalendarEventMapper::mapToEventWithTimeData)
                  .sorted(Comparator.comparing(event -> event.timeData().start()))
                  .toList()));

      relevantCalendarExternalIds.remove(RegionalHolidayCalendar.HOLIDAY_CALENDAR_ID);
    }

    List<UUID> notFoundCalendarExternalIds = getNotExistingCalendarIds(relevantCalendarExternalIds);
    relevantCalendarExternalIds.removeAll(notFoundCalendarExternalIds);

    Map<Long, CalendarEventData> idToEvent =
        calendarEventDomainModelHandler
            .findBusyEventsInCalendars(relevantCalendarExternalIds, timeRanges)
            .stream()
            .collect(
                Collectors.toMap(
                    CalendarEventData::getId, Function.identity(), (first, second) -> first));

    blockingEventsOfCalendars.addAll(
        relevantCalendarExternalIds.stream()
            .map(
                calendarExternalId ->
                    new BlockingEventsOfCalendar(
                        calendarExternalId,
                        idToEvent.values().stream()
                            .filter(
                                event ->
                                    event.getCalendars().stream()
                                        .anyMatch(
                                            calendar ->
                                                calendar
                                                    .getExternalId()
                                                    .equals(calendarExternalId)))
                            .sorted(
                                Comparator.comparing(CalendarEventData::getEventStart)
                                    .thenComparingLong(CalendarEventData::getId))
                            .map(CalendarEventMapper::mapToEventWithTimeData)
                            .toList()))
            .toList());

    return new GetBlockingEventsOfCalendarsResponse(
        blockingEventsOfCalendars, notFoundCalendarExternalIds);
  }

  public GetEventsWithTimeDataResponse getEventsWithTimeData(List<UUID> eventExternalIds) {
    List<CalendarEventData> events =
        calendarEventDomainModelHandler.findEventsById(eventExternalIds);
    List<UUID> notExistingEventExternalIds =
        identifyNotExistingIds(eventExternalIds, events, CalendarEventData::getExternalId);

    return new GetEventsWithTimeDataResponse(
        events.stream().map(CalendarEventMapper::mapToEventWithTimeData).toList(),
        notExistingEventExternalIds);
  }

  private static void validateStartBeforeEnd(Instant start, Instant end) {
    if (start.isAfter(end)) {
      throw new BadRequestException("End before start");
    }
  }

  private void validateEventTypeFitsToCalendarType(
      CalendarType calendarType, BaseEventTypeDto baseEventTypeDto) {
    if (calendarType.equals(CalendarType.GLOBAL)
        && !baseEventTypeDto.equals(BaseEventTypeDto.HOLIDAY)) {
      throw new BadRequestException("Only 'HOLIDAY' events allowed in global calendars");
    }
    if (calendarType.equals(CalendarType.RESOURCE)
        && !baseEventTypeDto.equals(BaseEventTypeDto.SERVICE)) {
      throw new BadRequestException("Only 'SERVICE' events allowed in resource calendars");
    }
    if (calendarType.equals(CalendarType.USER)
        && !baseEventTypeDto.equals(BaseEventTypeDto.VACATION)) {
      throw new BadRequestException("Only 'VACATION' events allowed in user calendars");
    }
  }

  private void validateNoSubjectForUserCalendar(CalendarType calendarType, String subject) {
    if (calendarType.equals(CalendarType.USER) && subject != null) {
      throw new BadRequestException("No subject allowed for user calendar events");
    }
  }

  private List<CalendarData> validateCalendarsExist(List<UUID> calendarExternalIds) {
    List<CalendarData> calendars =
        calendarEventDomainModelHandler.findCalendarsById(calendarExternalIds);
    if (calendars.size() != calendarExternalIds.size()) {
      throw new NotFoundException("CalendarId not found");
    }
    return calendars;
  }

  private static boolean isMapResponseWithSubject(CalendarData calendarData) {
    return !calendarData.getType().equals(CalendarType.USER)
        || calendarData.getUserId().equals(getCurrentUserId());
  }

  private void validatePermissionForBaseEventChange(CalendarData calendar) {
    if (calendar.getType().equals(CalendarType.USER)
        && !calendar.getUserId().equals(getCurrentUserId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
    if (calendar.getType().equals(CalendarType.RESOURCE)
        && currentUserHasNoRole(EmployeePermissionRole.BASE_RESOURCES_WRITE)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
    if (calendar.getType().equals(CalendarType.GLOBAL)
        && currentUserHasNoRole(EmployeePermissionRole.BASE_GLOBAL_CALENDARS_WRITE)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }
  }

  private List<UUID> getNotExistingCalendarIds(List<UUID> calendarExternalIds) {
    List<CalendarData> calendars =
        calendarEventDomainModelHandler.findCalendarsById(calendarExternalIds);
    if (calendars.size() == calendarExternalIds.size()) {
      return Collections.emptyList();
    } else {
      return identifyNotExistingIds(calendarExternalIds, calendars, CalendarData::getExternalId);
    }
  }

  private static <T> List<UUID> identifyNotExistingIds(
      List<UUID> allIds, List<T> existingEntities, Function<T, UUID> idExtractor) {
    List<UUID> notFoundIds = new ArrayList<>(allIds);
    notFoundIds.removeAll(existingEntities.stream().map(idExtractor).toList());
    return notFoundIds;
  }

  private static void validateNoGlobalCalendar(List<CalendarData> calendarDatas) {
    if (calendarDatas.stream()
        .anyMatch(calendarData -> calendarData.getType() == CalendarType.GLOBAL)) {
      String errorMessage = "No business case event in global calendars";
      throw new BadRequestException(errorMessage);
    }
  }

  private void validateNoConflictInResourceCalendars(
      List<CalendarData> calendarDatas,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      UUID currentEventExternalId) {
    List<UUID> resourceCalendarExternalIds =
        calendarDatas.stream()
            .filter(calendar -> calendar.getType().equals(CalendarType.RESOURCE))
            .map(CalendarData::getExternalId)
            .toList();
    if (resourceCalendarExternalIds.isEmpty()) {
      return;
    }

    List<CalendarEventData> existingEvents =
        calendarEventDomainModelHandler.findEventsInCalendarsUnsorted(
            resourceCalendarExternalIds, timeRangeStart, timeRangeEnd);
    if (existingEvents.isEmpty()) {
      return;
    }

    if (existingEvents.size() > 1
        || !existingEvents.getFirst().getExternalId().equals(currentEventExternalId)) {
      throw new BadRequestException(ErrorCode.CONFLICT, "A resource is already booked.");
    }
  }

  private CalendarEventData validateBaseEventExists(UUID eventExternalId) {
    CalendarEventData calendarEventData =
        calendarEventDomainModelHandler
            .findEvent(eventExternalId)
            .orElseThrow(CalendarEventService::eventNotFound);
    if (EventType.BUSINESS_CASE.equals(calendarEventData.getEventType())) {
      throw eventNotFound();
    }
    return calendarEventData;
  }

  private CalendarEventData validateBusinessCaseEventExists(UUID eventExternalId) {
    CalendarEventData calendarEventData =
        calendarEventDomainModelHandler
            .findEvent(eventExternalId)
            .orElseThrow(CalendarEventService::eventNotFound);
    if (!EventType.BUSINESS_CASE.equals(calendarEventData.getEventType())) {
      throw eventNotFound();
    }
    return calendarEventData;
  }

  private static void validateMaximumTimeRange(Instant timeRangeStart, Instant timeRangeEnd) {
    long days = ChronoUnit.DAYS.between(timeRangeStart, timeRangeEnd);
    if (days > MAXIMUM_DAYS) {
      String errorMessage =
          "Too many days between start and end, maximum is %s".formatted(MAXIMUM_DAYS);
      throw new BadRequestException(errorMessage);
    }
  }

  private static NotFoundException eventNotFound() {
    return new NotFoundException("Event not found");
  }
}
