/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.time.Instant;

@DataSensitivity(SensitivityLevel.SENSITIVE)
@Entity
public class UserDefinedAppointment extends GenericEntity<Long> {

  @Id private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  private ProstituteProtectionProcedure procedure;

  @Column(nullable = false)
  private Instant appointmentStart;

  @Column(nullable = false)
  private Instant appointmentEnd;

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ProstituteProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(ProstituteProtectionProcedure procedure) {
    this.procedure = procedure;
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
