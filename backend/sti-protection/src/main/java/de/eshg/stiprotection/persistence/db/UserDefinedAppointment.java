/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.time.Instant;

@DataSensitivity(SensitivityLevel.SENSITIVE)
@Entity
public class UserDefinedAppointment extends GenericEntity<Long> {

  @Id private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = BaseEntity_.ID)
  @MapsId
  private StiProtectionProcedure procedure;

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

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
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
