/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class LaboratoryTestSamplesData {

  private Boolean oralSampleRequested;
  @Embedded private LaboratoryTestData oralSampleData;
  private Boolean urethralSampleRequested;
  @Embedded private LaboratoryTestData urethralSampleData;
  private Boolean analSampleRequested;
  @Embedded private LaboratoryTestData analSampleData;

  public Boolean getOralSampleRequested() {
    return oralSampleRequested;
  }

  public void setOralSampleRequested(Boolean oralSampleRequested) {
    this.oralSampleRequested = oralSampleRequested;
  }

  public LaboratoryTestData getOralSampleData() {
    return oralSampleData;
  }

  public void setOralSampleData(LaboratoryTestData oralSampleData) {
    this.oralSampleData = oralSampleData;
  }

  public Boolean getUrethralSampleRequested() {
    return urethralSampleRequested;
  }

  public void setUrethralSampleRequested(Boolean urethralSampleRequested) {
    this.urethralSampleRequested = urethralSampleRequested;
  }

  public LaboratoryTestData getUrethralSampleData() {
    return urethralSampleData;
  }

  public void setUrethralSampleData(LaboratoryTestData urethralSampleData) {
    this.urethralSampleData = urethralSampleData;
  }

  public Boolean getAnalSampleRequested() {
    return analSampleRequested;
  }

  public void setAnalSampleRequested(Boolean analSampleRequested) {
    this.analSampleRequested = analSampleRequested;
  }

  public LaboratoryTestData getAnalSampleData() {
    return analSampleData;
  }

  public void setAnalSampleData(LaboratoryTestData analSampleData) {
    this.analSampleData = analSampleData;
  }
}
