/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue("ABSENCE")
public class AbsenceExaminationResult extends ExaminationResult {

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ReasonForAbsence reasonForAbsence;

  public ReasonForAbsence getReasonForAbsence() {
    return reasonForAbsence;
  }

  public void setReasonForAbsence(ReasonForAbsence reasonForAbsence) {
    this.reasonForAbsence = reasonForAbsence;
  }
}
