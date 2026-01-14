/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@MappedSuperclass
public abstract class AbstractAppointmentStandardDuration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration extraDuration = Duration.ZERO;

  public Duration getExtraDuration() {
    return extraDuration;
  }

  public void setExtraDuration(Duration extraDuration) {
    this.extraDuration = extraDuration;
  }
}
