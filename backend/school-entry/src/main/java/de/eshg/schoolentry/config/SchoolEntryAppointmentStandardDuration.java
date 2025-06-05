/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class SchoolEntryAppointmentStandardDuration extends BaseEntity implements Initializable {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = true;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration regularExamination;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration canChild;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration entryLevel;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration specialNeeds;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public Duration getRegularExamination() {
    return regularExamination;
  }

  public void setRegularExamination(Duration regularExamination) {
    this.regularExamination = regularExamination;
  }

  public Duration getCanChild() {
    return canChild;
  }

  public void setCanChild(Duration canChild) {
    this.canChild = canChild;
  }

  public Duration getEntryLevel() {
    return entryLevel;
  }

  public void setEntryLevel(Duration entryLevel) {
    this.entryLevel = entryLevel;
  }

  public Duration getSpecialNeeds() {
    return specialNeeds;
  }

  public void setSpecialNeeds(Duration specialNeeds) {
    this.specialNeeds = specialNeeds;
  }
}
