/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class CalendarEvent extends BaseEntityWithExternalId {
  @DataSensitivity(SensitivityLevel.PROTECTED)
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "calendar_to_event",
      joinColumns = {@JoinColumn(name = "event_id")},
      inverseJoinColumns = {@JoinColumn(name = "calendar_id")})
  private Set<Calendar> calendars = new LinkedHashSet<>();

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private EventType eventType;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AvailabilityType availability;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column
  private String subject;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant eventStart;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant eventEnd;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean wholeDay;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private UUID lastModifiedByUserId;

  public Set<Calendar> getCalendars() {
    return calendars;
  }

  public void setCalendars(Collection<Calendar> calendars) {
    this.calendars.clear();
    this.calendars.addAll(calendars);
  }

  public AvailabilityType getAvailability() {
    return availability;
  }

  public void setAvailability(AvailabilityType availability) {
    this.availability = availability;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public EventType getEventType() {
    return eventType;
  }

  public void setEventType(EventType eventType) {
    this.eventType = eventType;
  }

  public Instant getEventStart() {
    return eventStart;
  }

  public void setEventStart(Instant eventStart) {
    this.eventStart = eventStart;
  }

  public Instant getEventEnd() {
    return eventEnd;
  }

  public void setEventEnd(Instant eventEnd) {
    this.eventEnd = eventEnd;
  }

  public boolean isWholeDay() {
    return wholeDay;
  }

  public void setWholeDay(boolean wholeDay) {
    this.wholeDay = wholeDay;
  }

  public UUID getLastModifiedByUserId() {
    return lastModifiedByUserId;
  }

  public void setLastModifiedByUserId(UUID lastModifiedByUserId) {
    this.lastModifiedByUserId = lastModifiedByUserId;
  }
}
