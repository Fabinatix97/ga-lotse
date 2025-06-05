/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class TravelMedicineAppointmentStandardDuration extends BaseEntity implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = true;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration consultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration vaccination;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public Duration getConsultation() {
    return consultation;
  }

  public void setConsultation(Duration consultation) {
    this.consultation = consultation;
  }

  public Duration getVaccination() {
    return vaccination;
  }

  public void setVaccination(Duration vaccination) {
    this.vaccination = vaccination;
  }
}
