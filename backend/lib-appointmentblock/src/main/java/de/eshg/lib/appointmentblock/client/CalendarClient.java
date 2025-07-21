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
import de.eshg.base.calendar.api.GetEventsOfCalendarResponse;
import de.eshg.base.calendar.api.GetUserCalendarsRequest;
import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.lib.appointmentblock.model.CreateAppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

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
    UUID calendarId = calendarApiClient.getCurrentUserCalendar().calendarId();
    GetEventsOfCalendarResponse eventsOfCalendar =
        calendarEventApiClient.getEventsOfCalendar(
            calendarId,
            appointmentBlock.getAppointmentBlockStart(),
            appointmentBlock.getAppointmentBlockEnd());
    UUID calendarEventId = appointmentBlock.getCalendarEventId();
    if (eventsOfCalendar.events().stream().noneMatch(event -> event.id().equals(calendarEventId))) {
      return;
    }
    log.info("Deleting a business case event in the calendar with ID={}", calendarEventId);
    calendarEventApiClient.deleteBusinessCaseEvent(calendarEventId);
    log.info("Deleted a business case event in the calendar with ID={}", calendarEventId);
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
