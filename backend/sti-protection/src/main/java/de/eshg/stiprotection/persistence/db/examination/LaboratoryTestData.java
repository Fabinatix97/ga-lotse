/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
public class LaboratoryTestData {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean result;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String value;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String remark;

  public Boolean getResult() {
    return result;
  }

  public void setResult(Boolean result) {
    this.result = result;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }
}
