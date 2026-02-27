/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.mapper;

import de.eshg.base.calendar.api.BaseEventRequest;
import de.eshg.base.calendar.api.BaseEventTypeDto;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import de.eshg.base.calendar.api.EventMetaData;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.EventTypeDto;
import de.eshg.base.calendar.api.EventWithTimeData;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarEvent;
import de.eshg.base.calendar.persistence.entity.EventType;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class CalendarEventMapper {
  private CalendarEventMapper() {}

  public static CalendarEvent mapToPersistence(
      BaseEventRequest request, List<Calendar> calendars, UUID userId) {
    return mapToPersistence(request, calendars, new CalendarEvent(), userId);
  }

  public static CalendarEvent mapToPersistence(
      BaseEventRequest source, List<Calendar> calendars, CalendarEvent target, UUID userId) {
    target.setCalendars(calendars);
    target.setSubject(source.subject());
    target.setEventType(mapBaseEventType(source.type()));
    target.setEventStart(source.timeData().start());
    target.setEventEnd(source.timeData().end());
    target.setWholeDay(source.timeData().wholeDay());
    target.setLastModifiedByUserId(userId);
    return target;
  }

  private static EventType mapBaseEventType(BaseEventTypeDto eventTypeDto) {
    return EventType.valueOf(eventTypeDto.name());
  }

  public static CalendarEvent mapToPersistence(
      BusinessCaseEventRequest event, List<Calendar> calendars, UUID userId) {
    return mapToPersistence(event, calendars, new CalendarEvent(), userId);
  }

  public static CalendarEvent mapToPersistence(
      BusinessCaseEventRequest source,
      List<Calendar> calendars,
      CalendarEvent target,
      UUID userId) {
    target.setCalendars(calendars);
    target.setEventType(EventType.BUSINESS_CASE);
    target.setEventStart(source.timeData().start());
    target.setEventEnd(source.timeData().end());
    target.setWholeDay(source.timeData().wholeDay());
    target.setLastModifiedByUserId(userId);
    return target;
  }

  public static DetailedEvent mapToDetailedEvent(
      CalendarEventData calendarEventData, boolean mapWithSubject) {

    List<UserCalendar> userCalendars =
        calendarEventData.getCalendars().stream()
            .filter(cd -> Objects.nonNull(cd.getUserId()))
            .map(cd -> new UserCalendar(cd.getExternalId(), cd.getUserId()))
            .toList();

    List<ResourceCalendar> resourceCalendars =
        calendarEventData.getCalendars().stream()
            .filter(cd -> Objects.nonNull(cd.getResourceId()))
            .map(cd -> new ResourceCalendar(cd.getExternalId(), cd.getResourceId()))
            .toList();

    return new DetailedEvent(
        calendarEventData.getExternalId(),
        calendarEventData.getCalendars().stream().map(CalendarData::getExternalId).toList(),
        userCalendars,
        resourceCalendars,
        mapToEventTypeDto(calendarEventData.getEventType()),
        calendarEventData.getLastModifiedByUserId(),
        getEventMetaData(calendarEventData, mapWithSubject),
        new EventTimeData(
            calendarEventData.getEventStart(),
            calendarEventData.getEventEnd(),
            calendarEventData.isWholeDay()));
  }

  private static EventTypeDto mapToEventTypeDto(EventType eventType) {
    return switch (eventType) {
      case BUSINESS_CASE -> EventTypeDto.BUSINESS_CASE;
      case HOLIDAY -> EventTypeDto.HOLIDAY;
      case SERVICE -> EventTypeDto.SERVICE;
      case VACATION -> EventTypeDto.VACATION;
      case INFORMATION -> EventTypeDto.INFORMATION;
    };
  }

  public static DetailedEventWithoutCalendarId mapToDetailedEventWithoutCalendarId(
      CalendarEventData calendarEventData, boolean mapWithSubject) {

    return new DetailedEventWithoutCalendarId(
        calendarEventData.getExternalId(),
        mapToEventTypeDto(calendarEventData.getEventType()),
        calendarEventData.getLastModifiedByUserId(),
        getEventMetaData(calendarEventData, mapWithSubject),
        new EventTimeData(
            calendarEventData.getEventStart(),
            calendarEventData.getEventEnd(),
            calendarEventData.isWholeDay()));
  }

  private static EventMetaData getEventMetaData(
      CalendarEventData calendarEventData, boolean mapWithSubject) {
    return new EventMetaData(
        mapWithSubject ? calendarEventData.getSubject() : null, null, null, null, null);
  }

  public static EventWithTimeData mapToEventWithTimeData(
      DetailedEventWithoutCalendarId detailedEventWithoutCalendarId) {
    return new EventWithTimeData(
        detailedEventWithoutCalendarId.id(),
        new EventTimeData(
            detailedEventWithoutCalendarId.timeData().start(),
            detailedEventWithoutCalendarId.timeData().end(),
            detailedEventWithoutCalendarId.timeData().wholeDay()));
  }

  public static EventWithTimeData mapToEventWithTimeData(CalendarEventData calendarEventData) {
    return new EventWithTimeData(
        calendarEventData.getExternalId(),
        new EventTimeData(
            calendarEventData.getEventStart(),
            calendarEventData.getEventEnd(),
            calendarEventData.isWholeDay()));
  }
}
