/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
  private Duration initialConsultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration followUpConsultation;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public Duration getFollowUpConsultation() {
    return followUpConsultation;
  }

  public void setFollowUpConsultation(Duration prostituteProtectionConsultation) {
    this.followUpConsultation = prostituteProtectionConsultation;
  }

  public Duration getInitialConsultation() {
    return initialConsultation;
  }

  public void setInitialConsultation(Duration initial) {
    this.initialConsultation = initial;
  }
}
