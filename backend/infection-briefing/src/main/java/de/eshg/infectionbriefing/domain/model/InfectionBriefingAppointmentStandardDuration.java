/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.eshg.config.domain.Initializable;
import de.eshg.lib.appointmentblock.model.AbstractAppointmentStandardDuration;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class InfectionBriefingAppointmentStandardDuration
    extends AbstractAppointmentStandardDuration implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration infectionBriefingNew;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration infectionBriefingReplacement;

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  public Duration getInfectionBriefingNew() {
    return infectionBriefingNew;
  }

  public void setInfectionBriefingNew(Duration infectionBriefingNew) {
    this.infectionBriefingNew = infectionBriefingNew;
  }

  public Duration getInfectionBriefingReplacement() {
    return infectionBriefingReplacement;
  }

  public void setInfectionBriefingReplacement(Duration infectionBriefingReplacement) {
    this.infectionBriefingReplacement = infectionBriefingReplacement;
  }
}
