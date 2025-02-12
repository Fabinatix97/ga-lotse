/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue("FLUORIDATION")
public class FluoridationExaminationResult extends ExaminationResult {

  private Boolean fluorideVarnishApplied;

  public Boolean isFluorideVarnishApplied() {
    return fluorideVarnishApplied;
  }

  public void setFluorideVarnishApplied(Boolean fluorideVarnishApplied) {
    this.fluorideVarnishApplied = fluorideVarnishApplied;
  }
}
