/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import java.time.Instant;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Entity
@EntityListeners(AuditingEntityListener.class)
public class UserDefinedAppointment extends GloballyUniqueEntityBase {

  @Column(nullable = false)
  private Instant appointmentStart;

  @Column(nullable = false)
  private Instant appointmentEnd;

  public UserDefinedAppointment() {}

  public UserDefinedAppointment(Instant appointmentStart, Instant appointmentEnd) {
    this.appointmentStart = appointmentStart;
    this.appointmentEnd = appointmentEnd;
  }

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
}
