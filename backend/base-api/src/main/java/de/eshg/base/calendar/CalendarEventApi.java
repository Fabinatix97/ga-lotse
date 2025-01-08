/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

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
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(value = CalendarApi.BASE_URL)
public interface CalendarEventApi {
  String EVENT_URL = BaseUrls.Base.CALENDAR_EVENT_API_EVENT_URL;
  String BUSINESS_MODULE_EVENT_URL = BaseUrls.Base.CALENDAR_EVENT_API_BUSINESS_MODULE_EVENT_URL;
  String BASE_EVENT_URL = BaseUrls.Base.CALENDAR_EVENT_API_BASE_EVENT_URL;

  @PostExchange(value = BASE_EVENT_URL, accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Add an event to a calendar")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the event with augmented attributes, eg. the id")
  DetailedEvent addBaseEvent(@Valid @RequestBody BaseEventRequest event);

  @PutExchange(value = BASE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Update an existing event in a calendar")
  @ApiResponse(responseCode = "200", description = "Returns the updated event")
  DetailedEvent updateBaseEvent(
      @PathVariable(name = "eventId") UUID eventId, @Valid @RequestBody BaseEventRequest event);

  @GetExchange(value = BASE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get an event")
  @ApiResponse(responseCode = "200", description = "Returns the event")
  DetailedEvent getBaseEvent(@PathVariable(name = "eventId") UUID eventId);

  @DeleteExchange(value = BASE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Delete an event")
  @ApiResponse(responseCode = "200", description = "Returned when the event was deleted")
  void deleteBaseEvent(@PathVariable(name = "eventId") UUID eventId);

  @PostExchange(value = BUSINESS_MODULE_EVENT_URL, accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Add an event to multiple calendars, global calendars not allowed")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the event with augmented attributes, eg. the id")
  DetailedEvent addBusinessCaseEvent(@Valid @RequestBody BusinessCaseEventRequest event);

  @PutExchange(value = BUSINESS_MODULE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Update an existing event")
  @ApiResponse(responseCode = "200", description = "Returns the updated event")
  DetailedEvent updateBusinessCaseEvent(
      @PathVariable(name = "eventId") UUID eventId,
      @Valid @RequestBody BusinessCaseEventRequest event);

  @GetExchange(value = BUSINESS_MODULE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get an event")
  @ApiResponse(responseCode = "200", description = "Returns the event")
  GetBusinessCaseEventResponse getBusinessCaseEvent(@PathVariable(name = "eventId") UUID eventId);

  @DeleteExchange(value = BUSINESS_MODULE_EVENT_URL + "/{eventId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Delete an event")
  @ApiResponse(responseCode = "200", description = "Returned when the event was deleted")
  void deleteBusinessCaseEvent(@PathVariable(name = "eventId") UUID eventId);

  @GetExchange(value = "/{calendarId}" + EVENT_URL, accept = APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Get all events in a calendar for a given time range",
      description =
          "The search by date is including events with timeRangeEnd = event.start and timeRangeStart = event.end")
  @ApiResponse(responseCode = "200", description = "Returns the events in the calendar")
  GetEventsOfCalendarResponse getEventsOfCalendar(
      @PathVariable(name = "calendarId") UUID calendarId,
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd);

  @PostExchange(value = EVENT_URL + "/bulk-get", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get multiple events")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the events and a list of event ids which could not be found")
  GetEventsWithTimeDataResponse getEventsWithTimeData(
      @Valid @RequestBody GetEventsWithTimeDataRequest getEventsWithTimeDataRequest);

  @PostExchange(value = EVENT_URL + "/blocking/resources/bulk-get", accept = APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Get all blocking events in the calendars of the requested resources",
      description =
          "The search by date is including events with timeRangeEnd = event.start and timeRangeStart = event.end")
  @ApiResponse(responseCode = "200", description = "Returns the blocking events in the time range")
  GetBlockingEventsOfResourcesResponse getBlockingEventsOfResourceCalendars(
      @Valid @RequestBody GetBlockingEventsOfResourcesRequest request);

  @PostExchange(value = EVENT_URL + "/blocking/bulk-get", accept = APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Get all blocking events in the calendars",
      description =
          "The search by date is including events with timeRangeEnd = event.start and timeRangeStart = event.end")
  @ApiResponse(responseCode = "200", description = "Returns the blocking events in the time range")
  GetBlockingEventsOfCalendarsResponse getBlockingEventsOfCalendars(
      @Valid @RequestBody GetBlockingEventsOfCalendarsRequest request);
}
