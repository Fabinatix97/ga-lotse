/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.persistence.entity.CalendarEvent;
import de.eshg.base.calendar.persistence.entity.EventType;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class CalendarEventData {
  private final Long id;
  private final UUID externalId;
  private final Set<CalendarData> calendars;
  private final String subject;
  private final EventType eventType;
  private final Instant eventStart;
  private final Instant eventEnd;
  private final boolean wholeDay;
  private final UUID lastModifiedByUserId;

  public CalendarEventData(CalendarEvent calendarEvent) {
    id = calendarEvent.getId();
    externalId = calendarEvent.getExternalId();
    calendars =
        calendarEvent.getCalendars().stream()
            .map(CalendarData::new)
            .collect(StreamUtil.toLinkedHashSet());
    subject = calendarEvent.getSubject();
    eventType = calendarEvent.getEventType();
    eventStart = calendarEvent.getEventStart();
    eventEnd = calendarEvent.getEventEnd();
    wholeDay = calendarEvent.isWholeDay();
    lastModifiedByUserId = calendarEvent.getLastModifiedByUserId();
  }

  public Long getId() {
    return id;
  }

  public UUID getExternalId() {
    return externalId;
  }

  public Set<CalendarData> getCalendars() {
    return calendars;
  }

  public String getSubject() {
    return subject;
  }

  public EventType getEventType() {
    return eventType;
  }

  public Instant getEventStart() {
    return eventStart;
  }

  public Instant getEventEnd() {
    return eventEnd;
  }

  public boolean isWholeDay() {
    return wholeDay;
  }

  public UUID getLastModifiedByUserId() {
    return lastModifiedByUserId;
  }
}
