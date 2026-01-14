/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Entity
public class InspectionAppointment extends BaseEntity {
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant appointmentStart;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant appointmentEnd;

  public Instant getAppointmentStart() {
    return appointmentStart;
  }

  public void setAppointmentStart(Instant appointmentStart) {
    this.appointmentStart = appointmentStart;
  }

  public Instant getAppointmentEnd() {
    return appointmentEnd;
  }

  public void setAppointmentEnd(Instant appointmentEnd) {
    this.appointmentEnd = appointmentEnd;
  }

  public InspectionAppointment getClone() {
    InspectionAppointment clone = new InspectionAppointment();
    clone.setAppointmentStart(appointmentStart);
    clone.setAppointmentEnd(appointmentEnd);
    return clone;
  }
}
