/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue("SCREENING")
public class ScreeningExaminationResult extends ExaminationResult {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OralHygieneStatus oralHygieneStatus;

  public OralHygieneStatus getOralHygieneStatus() {
    return oralHygieneStatus;
  }

  public void setOralHygieneStatus(OralHygieneStatus oralHygieneStatus) {
    this.oralHygieneStatus = oralHygieneStatus;
  }
}
