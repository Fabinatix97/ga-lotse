/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.client;

import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.GetBusinessCaseEventResponse;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
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

  public UUID createEventInUserCalendar(Instant start, Instant end) {
    return createEventInUserCalendar(start, end, null);
  }

  public UUID createEventInUserCalendar(Instant start, Instant end, UUID userId) {
    UUID calendarId = getCalendarId(userId);
    BusinessCaseEventRequest createEventRequest =
        createBusinessCaseEventRequest(start, end, calendarId);
    log.info("Creating a business case event in user calendar {}...", calendarId);
    DetailedEvent detailedEvent = calendarEventApiClient.addBusinessCaseEvent(createEventRequest);
    log.info(
        "Created a business case event in user calendar {}: {}", calendarId, detailedEvent.id());
    return detailedEvent.id();
  }

  public UUID updateEventInUserCalendar(UUID calendarEventId, UUID userId) {
    DetailedEvent calendarEvent = getCalendarEvent(calendarEventId);
    return updateEventInUserCalendar(
        calendarEventId, calendarEvent.timeData().start(), calendarEvent.timeData().end(), userId);
  }

  public UUID updateEventInUserCalendar(
      UUID calendarEventId, Instant start, Instant end, UUID userId) {
    UUID calendarId = getCalendarId(userId);
    BusinessCaseEventRequest createEventRequest =
        createBusinessCaseEventRequest(start, end, calendarId);
    log.info("Updating business case event {} in user calendar {}...", calendarEventId, calendarId);
    DetailedEvent detailedEvent =
        calendarEventApiClient.updateBusinessCaseEvent(calendarEventId, createEventRequest);
    log.info("Updated business case event {} in user calendar {}", detailedEvent.id(), calendarId);
    return detailedEvent.id();
  }

  private static BusinessCaseEventRequest createBusinessCaseEventRequest(
      Instant start, Instant end, UUID calendarId) {
    return new BusinessCaseEventRequest(List.of(calendarId), new EventTimeData(start, end, false));
  }

  private UUID getCalendarId(UUID userId) {
    return userId != null ? getUserCalendar(userId) : getCurrentUserCalendar();
  }

  private UUID getCurrentUserCalendar() {
    return calendarApiClient.getCurrentUserCalendar().calendarId();
  }

  private UUID getUserCalendar(UUID userId) {
    return calendarApiClient.getUserCalendar(userId).calendarId();
  }

  private DetailedEvent getCalendarEvent(UUID calendarEventId) {
    GetBusinessCaseEventResponse businessCaseEvent =
        calendarEventApiClient.getBusinessCaseEvent(calendarEventId);
    return businessCaseEvent.event();
  }
}
