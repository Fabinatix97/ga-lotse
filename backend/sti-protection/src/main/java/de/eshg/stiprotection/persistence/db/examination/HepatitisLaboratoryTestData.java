/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class HepatitisLaboratoryTestData {
  private Boolean infection;
  private Boolean vaccineTitre;
  private String value;
  private String remark;

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
