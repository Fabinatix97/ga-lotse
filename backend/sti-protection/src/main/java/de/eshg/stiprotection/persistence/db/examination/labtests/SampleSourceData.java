/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class SampleSourceData extends LabTestData {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean oral;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean anal;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean urethral;

  public SampleSourceData() {}

  public SampleSourceData(
      Boolean result, String value, String remark, Boolean oral, Boolean anal, Boolean urethral) {
    super(result, value, remark);
    this.oral = oral;
    this.anal = anal;
    this.urethral = urethral;
  }

  public Boolean getOral() {
    return oral;
  }

  public void setOral(Boolean oral) {
    this.oral = oral;
  }

  public Boolean getAnal() {
    return anal;
  }

  public void setAnal(Boolean anal) {
    this.anal = anal;
  }

  public Boolean getUrethral() {
    return urethral;
  }

  public void setUrethral(Boolean urethral) {
    this.urethral = urethral;
  }
}
