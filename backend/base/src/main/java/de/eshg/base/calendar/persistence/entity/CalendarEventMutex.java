/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Entity
public class CalendarEventMutex extends BaseEntity {
  @NotNull
  @Column(unique = true)
  private UUID calendarExternalId;

  @NotNull private Instant expiryTime;

  public Instant getExpiryTime() {
    return expiryTime;
  }

  public void setExpiryTime(Instant expiryTime) {
    this.expiryTime = expiryTime;
  }

  public UUID getCalendarExternalId() {
    return calendarExternalId;
  }

  public void setCalendarExternalId(UUID calendarId) {
    this.calendarExternalId = calendarId;
  }
}
