/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("OTHER_SERVICE")
public class OtherService extends VcService {

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  private String description;

  public OtherService() {
    super();
  }

  public OtherService(
      VaccinationConsultation vaccinationConsultation, String description, BigDecimal fee) {
    super(vaccinationConsultation, fee);
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
