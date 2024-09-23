/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class ExaminationResult {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ExaminationResultValue value;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DoctorLetterValue doctorLetter;

  public ExaminationResultValue getValue() {
    return value;
  }

  public void setValue(ExaminationResultValue value) {
    this.value = value;
  }

  public DoctorLetterValue getDoctorLetter() {
    return doctorLetter;
  }

  public void setDoctorLetter(DoctorLetterValue doctorLetter) {
    this.doctorLetter = doctorLetter;
  }
}
