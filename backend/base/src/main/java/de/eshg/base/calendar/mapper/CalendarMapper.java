/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.mapper;

import de.eshg.base.calendar.api.AddGlobalCalendarRequest;
import de.eshg.base.calendar.api.CalendarDto;
import de.eshg.base.calendar.api.CalendarTypeDto;
import de.eshg.base.calendar.api.GlobalCalendar;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import java.util.UUID;

public class CalendarMapper {
  private CalendarMapper() {}

  public static Calendar mapToDomain(AddGlobalCalendarRequest request) {
    Calendar calendar = new Calendar();
    calendar.setType(CalendarType.GLOBAL);
    calendar.setGlobalCalendarName(request.globalCalendarName());
    return calendar;
  }

  public static Calendar mapToDomain(UUID userId) {
    Calendar calendar = new Calendar();
    calendar.setType(CalendarType.USER);
    calendar.setUserId(userId);
    return calendar;
  }

  public static GlobalCalendar mapToGlobalCalendarResponse(Calendar calendar) {
    return new GlobalCalendar(calendar.getExternalId(), calendar.getGlobalCalendarName());
  }

  public static ResourceCalendar mapToResourceCalendar(Calendar calendar) {
    return new ResourceCalendar(calendar.getExternalId(), calendar.getResourceId());
  }

  public static UserCalendar mapToUserCalendar(Calendar calendar) {
    return new UserCalendar(calendar.getExternalId(), calendar.getUserId());
  }

  public static CalendarDto mapCalendarToApi(Calendar calendar) {
    return new CalendarDto(
        calendar.getExternalId(),
        mapCalendarType(calendar.getType()),
        calendar.getGlobalCalendarName(),
        calendar.getUserId(),
        calendar.getResourceId());
  }

  private static CalendarTypeDto mapCalendarType(CalendarType type) {
    return CalendarTypeDto.valueOf(type.name());
  }
}
