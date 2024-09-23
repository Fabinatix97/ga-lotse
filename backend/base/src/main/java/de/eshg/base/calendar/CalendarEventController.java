/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import de.eshg.base.calendar.api.BaseEventRequest;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsRequest;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsResponse;
import de.eshg.base.calendar.api.GetBlockingEventsOfResourcesRequest;
import de.eshg.base.calendar.api.GetBlockingEventsOfResourcesResponse;
import de.eshg.base.calendar.api.GetBusinessCaseEventResponse;
import de.eshg.base.calendar.api.GetEventsOfCalendarResponse;
import de.eshg.base.calendar.api.GetEventsWithTimeDataRequest;
import de.eshg.base.calendar.api.GetEventsWithTimeDataResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "CalendarEvent")
public class CalendarEventController implements CalendarEventApi {

  private final CalendarEventService calendarEventService;

  public CalendarEventController(CalendarEventService calendarEventService) {
    this.calendarEventService = calendarEventService;
  }

  @Override
  public DetailedEvent addBaseEvent(BaseEventRequest event) {
    return calendarEventService.addBaseEvent(event);
  }

  @Override
  public DetailedEvent updateBaseEvent(UUID eventId, BaseEventRequest event) {
    return calendarEventService.updateBaseEvent(eventId, event);
  }

  @Override
  public DetailedEvent getBaseEvent(UUID eventId) {
    return calendarEventService.getBaseEvent(eventId);
  }

  @Override
  public void deleteBaseEvent(UUID eventId) {
    calendarEventService.deleteBaseEvent(eventId);
  }

  @Override
  public DetailedEvent addBusinessCaseEvent(BusinessCaseEventRequest event) {
    return calendarEventService.addBusinessCaseEvent(event);
  }

  @Override
  public DetailedEvent updateBusinessCaseEvent(UUID eventId, BusinessCaseEventRequest event) {
    return calendarEventService.updateBusinessCaseEvent(eventId, event);
  }

  @Override
  public GetBusinessCaseEventResponse getBusinessCaseEvent(UUID eventId) {
    return calendarEventService.getBusinessCaseEvent(eventId);
  }

  @Override
  public void deleteBusinessCaseEvent(UUID eventId) {
    calendarEventService.deleteBusinessCaseEvent(eventId);
  }

  @Override
  public GetEventsOfCalendarResponse getEventsOfCalendar(
      UUID calendarId, Instant timeRangeStart, Instant timeRangeEnd) {
    return calendarEventService.getDetailedEventsOfCalendar(
        calendarId, timeRangeStart, timeRangeEnd);
  }

  @Override
  public GetEventsWithTimeDataResponse getEventsWithTimeData(
      GetEventsWithTimeDataRequest getEventsWithTimeDataRequest) {
    return calendarEventService.getEventsWithTimeData(getEventsWithTimeDataRequest.eventIds());
  }

  @Override
  public GetBlockingEventsOfResourcesResponse getBlockingEventsOfResourceCalendars(
      GetBlockingEventsOfResourcesRequest request) {
    return calendarEventService.findBusyEventsOfResourceCalendars(
        request.resourceIds(), request.timeRangeStart(), request.timeRangeEnd());
  }

  @Override
  public GetBlockingEventsOfCalendarsResponse getBlockingEventsOfCalendars(
      GetBlockingEventsOfCalendarsRequest request) {
    return calendarEventService.findBusyEventsOfCalendars(
        request.calendarIds(), request.timeRanges());
  }
}
