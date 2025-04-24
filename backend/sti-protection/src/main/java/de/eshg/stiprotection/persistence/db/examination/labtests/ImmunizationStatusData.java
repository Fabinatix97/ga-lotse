/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class ImmunizationStatusData extends LabTestData {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean infection;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean vaccineTitre;

  public ImmunizationStatusData() {}

  public ImmunizationStatusData(
      Boolean result, String value, String remark, Boolean infection, Boolean vaccineTitre) {
    super(result, value, remark);
    this.infection = infection;
    this.vaccineTitre = vaccineTitre;
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
}
