/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.database;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class MedsAbroadAppointmentStandardDuration extends BaseEntity implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = true;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration certification;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public Duration getCertification() {
    return certification;
  }

  public void setCertification(Duration medsAbroadCertification) {
    this.certification = medsAbroadCertification;
  }
}
