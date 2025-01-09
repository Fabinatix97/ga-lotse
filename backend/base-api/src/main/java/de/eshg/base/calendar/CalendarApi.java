/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.base.calendar.api.AddGlobalCalendarRequest;
import de.eshg.base.calendar.api.GetCalendarsResponse;
import de.eshg.base.calendar.api.GetRelevantCalendarsResponse;
import de.eshg.base.calendar.api.GetResourceCalendarsRequest;
import de.eshg.base.calendar.api.GetResourceCalendarsResponse;
import de.eshg.base.calendar.api.GetUserCalendarsRequest;
import de.eshg.base.calendar.api.GetUserCalendarsResponse;
import de.eshg.base.calendar.api.GlobalCalendar;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(value = CalendarApi.BASE_URL)
public interface CalendarApi {
  String BASE_URL = BaseUrls.Base.CALENDAR_API;

  String GLOBAL_CALENDAR_URL = BaseUrls.Base.CALENDAR_API_GLOBAL_CALENDAR_URL;
  String USER_CALENDAR_URL = BaseUrls.Base.CALENDAR_API_USER_CALENDAR_URL;
  String RESOURCE_CALENDAR_URL = BaseUrls.Base.CALENDAR_API_RESOURCE_CALENDAR_URL;

  @PostExchange(value = GLOBAL_CALENDAR_URL, accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Add a global calendar")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the Calendar with augmented attributes, eg. the id")
  GlobalCalendar addGlobalCalendar(
      @Valid @RequestBody AddGlobalCalendarRequest addGlobalCalendarRequest);

  @GetExchange(value = RESOURCE_CALENDAR_URL + "/{resourceId}", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get a resource calendar")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the Calendar with augmented attributes, eg. the id")
  ResourceCalendar getResourceCalendar(@PathVariable(name = "resourceId") UUID resourceId);

  @PostExchange(value = RESOURCE_CALENDAR_URL + "/bulk-get", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get multiple resource calendars")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns links of calendar and resource id and a list of resource ids which could not be found")
  GetResourceCalendarsResponse getResourceCalendars(
      @Valid @RequestBody GetResourceCalendarsRequest getResourceCalendarsRequest);

  @GetExchange(value = USER_CALENDAR_URL + "/self", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get the user calendar of the current user")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the Calendar with augmented attributes, eg. the id")
  UserCalendar getCurrentUserCalendar();

  @GetExchange(
      value = USER_CALENDAR_URL + "/relevant-calendars/self",
      accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get the calendars relevant for the current user")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns information about the calendar of the current user as well as calendars of users in relevant groups and global calendars")
  GetRelevantCalendarsResponse getRelevantCalendarsForCurrentUser();

  @PostExchange(value = USER_CALENDAR_URL + "/bulk-get", accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "Get multiple user calendars")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns links of calendar and user id and a list of user ids which could not be found")
  GetUserCalendarsResponse getUserCalendars(
      @Valid @RequestBody GetUserCalendarsRequest getUserCalendarsRequest);

  @GetExchange(accept = APPLICATION_JSON_VALUE)
  @Operation(summary = "List all calendars")
  @ApiResponse(responseCode = "200", description = "Returns all/global calendars")
  GetCalendarsResponse getCalendars(
      @RequestParam(name = "onlyGlobal", required = false, defaultValue = "false")
          Boolean onlyGlobal);
}
