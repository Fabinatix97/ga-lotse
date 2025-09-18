/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.client;

import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsRequest;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsResponse;
import de.eshg.base.calendar.api.GetUserCalendarsRequest;
import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.util.CollectionUtils;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentBlockRequest;
import de.eshg.lib.appointmentblock.model.CreateAppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException.NotFound;

@Component
public class CalendarClient {

  private static final Logger log = LoggerFactory.getLogger(CalendarClient.class);

  private final CalendarApi calendarApiClient;
  private final CalendarEventApi calendarEventApiClient;

  public CalendarClient(CalendarApi calendarApiClient, CalendarEventApi calendarEventApiClient) {
    this.calendarApiClient = calendarApiClient;
    this.calendarEventApiClient = calendarEventApiClient;
  }

  public UUID createEventInCalendar(Instant start, Instant end, List<UUID> usersForEvent) {
    List<UserCalendar> userCalendars = getUserCalendarIds(usersForEvent);
    List<UUID> calendarIds = userCalendars.stream().map(UserCalendar::calendarId).toList();
    log.info("Using user calendars with IDs={}", calendarIds);

    BusinessCaseEventRequest createEventRequest =
        new BusinessCaseEventRequest(calendarIds, new EventTimeData(start, end, false));
    log.info("Creating a business case event in the calendar");
    DetailedEvent detailedEvent = calendarEventApiClient.addBusinessCaseEvent(createEventRequest);
    log.info("Created a business case event in the calendar with ID={}", detailedEvent.id());
    return detailedEvent.id();
  }

  public void removeEventInCalendarIfExists(AppointmentBlock appointmentBlock) {
    UUID calendarEventId = appointmentBlock.getCalendarEventId();
    log.info("Deleting a business case event in the calendar with ID={}", calendarEventId);
    try {
      calendarEventApiClient.deleteBusinessCaseEvent(calendarEventId);
    } catch (NotFound notFound) {
      log.error(
          "Could not delete a business case event in the calendar with ID={}",
          calendarEventId,
          notFound);
      return;
    }
    log.info("Deleted a business case event in the calendar with ID={}", calendarEventId);
  }

  public void updateEventInCalendarIfExists(
      AppointmentBlock appointmentBlock,
      UpdateAppointmentBlockRequest request,
      List<UUID> usersToRemove,
      List<UUID> usersToAdd) {
    UUID calendarEventId = appointmentBlock.getCalendarEventId();
    List<UUID> calendarIds =
        calendarEventApiClient.getBusinessCaseEvent(calendarEventId).event().calendarIds();

    if (!usersToRemove.isEmpty() || !usersToAdd.isEmpty()) {
      calendarIds = new ArrayList<>(calendarIds);

      List<UUID> userChanges = CollectionUtils.union(usersToRemove, usersToAdd);
      List<UserCalendar> userCalendars = getUserCalendarIds(userChanges);
      Map<UUID, UUID> calendarsByUser =
          userCalendars.stream()
              .collect(Collectors.toMap(UserCalendar::userId, UserCalendar::calendarId));
      usersToRemove.stream()
          .flatMap(mapToCalendarIfExists(calendarsByUser))
          .forEach(calendarIds::remove);
      usersToAdd.stream().flatMap(mapToCalendarIfExists(calendarsByUser)).forEach(calendarIds::add);
    }

    log.info("Updating a business case event in the calendar with ID={}", calendarEventId);
    calendarEventApiClient.updateBusinessCaseEvent(
        calendarEventId,
        new BusinessCaseEventRequest(
            calendarIds, new EventTimeData(request.start(), request.end(), false)));
    log.info("Updating a business case event in the calendar with ID={}", calendarEventId);
  }

  private static Function<UUID, Stream<UUID>> mapToCalendarIfExists(
      Map<UUID, UUID> calendarsByUser) {
    return (userId) -> {
      var calendarId = calendarsByUser.get(userId);
      if (calendarId == null) {
        log.warn("No calendar found for user with ID={}", userId);
        return Stream.empty();
      }
      return Stream.of(calendarId);
    };
  }

  private List<UserCalendar> getUserCalendarIds(List<UUID> usersForEvent) {
    GetUserCalendarsRequest getUserCalendarsRequest = new GetUserCalendarsRequest(usersForEvent);

    return calendarApiClient.getUserCalendars(getUserCalendarsRequest).userCalendars();
  }

  public List<UUID> getUserIdsWithEventConflicts(
      List<UUID> userIds, List<CreateAppointmentBlockData> appointmentBlocks) {
    List<UserCalendar> userCalendars = getUserCalendarIds(userIds);
    Map<UUID, UUID> calendarUserMap =
        userCalendars.stream()
            .collect(Collectors.toMap(UserCalendar::calendarId, UserCalendar::userId));
    List<UUID> calendarIds = userCalendars.stream().map(UserCalendar::calendarId).toList();
    List<TimeRange> timeRanges = appointmentBlocks.stream().map(this::mapToTimeRange).toList();

    GetBlockingEventsOfCalendarsRequest request =
        new GetBlockingEventsOfCalendarsRequest(calendarIds, timeRanges);
    GetBlockingEventsOfCalendarsResponse blockingEventsOfCalendars =
        calendarEventApiClient.getBlockingEventsOfCalendars(request);
    return blockingEventsOfCalendars.calendarsWithBlockingEvents().stream()
        .filter(e -> !e.events().isEmpty())
        .map(e -> calendarUserMap.get(e.calendarId()))
        .toList();
  }

  private TimeRange mapToTimeRange(CreateAppointmentBlockData appointmentBlock) {
    return new TimeRange(appointmentBlock.start(), appointmentBlock.end());
  }
}
