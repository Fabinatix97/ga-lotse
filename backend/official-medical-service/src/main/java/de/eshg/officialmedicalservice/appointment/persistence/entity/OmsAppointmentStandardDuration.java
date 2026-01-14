/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.appointment.persistence.entity;

import de.eshg.config.domain.Initializable;
import de.eshg.lib.appointmentblock.model.AbstractAppointmentStandardDuration;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class OmsAppointmentStandardDuration extends AbstractAppointmentStandardDuration
    implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  boolean initialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration officialMedicalServiceShort;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration officialMedicalServiceLong;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public Duration getOfficialMedicalServiceShort() {
    return officialMedicalServiceShort;
  }

  public void setOfficialMedicalServiceShort(Duration officialMedicalServiceShort) {
    this.officialMedicalServiceShort = officialMedicalServiceShort;
  }

  public Duration getOfficialMedicalServiceLong() {
    return officialMedicalServiceLong;
  }

  public void setOfficialMedicalServiceLong(Duration officialMedicalServiceLong) {
    this.officialMedicalServiceLong = officialMedicalServiceLong;
  }
}
