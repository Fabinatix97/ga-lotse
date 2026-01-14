/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("OTHER")
public class OtherTests extends LabTestData {
  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String otherTestName;

  public OtherTests() {}

  public OtherTests(Boolean result, String value, String remark, String otherTestName) {
    super(result, value, remark);
    this.otherTestName = otherTestName;
  }

  public String getOtherTestName() {
    return otherTestName;
  }

  public void setOtherTestName(String otherTestName) {
    this.otherTestName = otherTestName;
  }
}
