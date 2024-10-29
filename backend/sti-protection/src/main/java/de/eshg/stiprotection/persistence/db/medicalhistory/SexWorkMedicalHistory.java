/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.UNDEFINED)
@DiscriminatorValue(value = "SEX_WORK")
public class SexWorkMedicalHistory extends MedicalHistory {

  private String medications;

  public String getMedications() {
    return medications;
  }

  public void setMedications(String medications) {
    this.medications = medications;
  }
}
