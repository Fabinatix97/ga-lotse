/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class AppointmentHistoryEntry {

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentType appointmentType;

  @Column(nullable = false)
  private Instant appointmentStart;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentStatus appointmentStatus;

  public AppointmentType getAppointmentType() {
    return appointmentType;
  }

  public void setAppointmentType(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
  }

  public Instant getAppointmentStart() {
    return appointmentStart;
  }

  public void setAppointmentStart(Instant appointmentStart) {
    this.appointmentStart = appointmentStart;
  }

  public AppointmentStatus getAppointmentStatus() {
    return appointmentStatus;
  }

  public void setAppointmentStatus(AppointmentStatus appointmentStatus) {
    this.appointmentStatus = appointmentStatus;
  }
}
