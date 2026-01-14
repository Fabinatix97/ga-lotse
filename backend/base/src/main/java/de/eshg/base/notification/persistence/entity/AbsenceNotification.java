/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.notification.domain.model.Notification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.util.UUID;

@Entity
public class AbsenceNotification extends Notification {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant eventStart;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant eventEnd;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private UUID absentUser;

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

  public UUID getAbsentUser() {
    return absentUser;
  }

  public void setAbsentUser(UUID absentUser) {
    this.absentUser = absentUser;
  }
}
