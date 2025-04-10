/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
public class HepatitisLaboratoryTestData {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean result;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean infection;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean vaccineTitre;

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

  public Boolean getInfection() {
    return infection;
  }

  public void setInfection(Boolean infection) {
    this.infection = infection;
  }

  public Boolean getVaccineTitre() {
    return vaccineTitre;
  }

  public void setVaccineTitre(Boolean vaccineTitre) {
    this.vaccineTitre = vaccineTitre;
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
