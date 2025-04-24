/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SYPH")
public class SyphilisTest extends LabTestData {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hadSyphilis;

  public SyphilisTest() {}

  public SyphilisTest(Boolean result, String value, String remark, Boolean hadSyphilis) {
    super(result, value, remark);
    this.hadSyphilis = hadSyphilis;
  }

  public Boolean getHadSyphilis() {
    return hadSyphilis;
  }

  public void setHadSyphilis(Boolean hadSyphilis) {
    this.hadSyphilis = hadSyphilis;
  }
}
