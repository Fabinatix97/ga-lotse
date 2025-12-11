/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.config.domain.Initializable;
import de.eshg.lib.appointmentblock.model.AbstractAppointmentStandardDuration;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class ProstituteProtectionAppointmentStandardDuration
    extends AbstractAppointmentStandardDuration implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration consultation;

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

  public void setConsultation(Duration prostituteProtectionConsultation) {
    this.consultation = prostituteProtectionConsultation;
  }
}
