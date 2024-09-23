/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

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
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Calendar")
public class CalendarController implements CalendarApi {

  private final CalendarService calendarService;

  public CalendarController(CalendarService calendarService) {
    this.calendarService = calendarService;
  }

  @Override
  public GlobalCalendar addGlobalCalendar(AddGlobalCalendarRequest addGlobalCalendarRequest) {
    return calendarService.addGlobalCalendar(addGlobalCalendarRequest);
  }

  @Override
  public ResourceCalendar getResourceCalendar(UUID resourceId) {
    return calendarService.getResourceCalendar(resourceId);
  }

  @Override
  public GetResourceCalendarsResponse getResourceCalendars(
      GetResourceCalendarsRequest getResourceCalendarsRequest) {
    return calendarService.getResourceCalendars(getResourceCalendarsRequest.resourceIds());
  }

  @Override
  public UserCalendar getUserCalendar(UUID userId) {
    return calendarService.getUserCalendar(userId);
  }

  @Override
  public UserCalendar getCurrentUserCalendar() {
    return calendarService.getCurrentUserCalendar();
  }

  @Override
  public GetRelevantCalendarsResponse getRelevantCalendarsForCurrentUser() {
    UserCalendar currentUserCalendar = calendarService.getCurrentUserCalendar();
    return calendarService.getRelevantCalendars(currentUserCalendar);
  }

  @Override
  public GetUserCalendarsResponse getUserCalendars(
      GetUserCalendarsRequest getUserCalendarsRequest) {
    return calendarService.getUserCalendars(getUserCalendarsRequest.userIds());
  }

  @Override
  public GetCalendarsResponse getCalendars(Boolean onlyGlobal) {
    return calendarService.getCalendars(onlyGlobal != null && onlyGlobal);
  }
}
