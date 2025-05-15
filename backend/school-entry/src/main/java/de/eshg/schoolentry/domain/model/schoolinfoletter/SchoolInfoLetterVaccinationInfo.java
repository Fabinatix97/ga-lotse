/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model.schoolinfoletter;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SchoolInfoLetterVaccinationInfo extends BaseEntity {
  @OneToOne(optional = false)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  private Boolean measlesProtectionComplete;
  private boolean vaccinationPassNotPresented;
  private boolean measlesContraIndication;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolInfoLetterMeaslesContraIndicationDuration measlesContraIndicationDuration;

  private LocalDate measlesContraIndicationUntil;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public Boolean isMeaslesProtectionComplete() {
    return measlesProtectionComplete;
  }

  public void setMeaslesProtectionComplete(Boolean measlesProtectionComplete) {
    this.measlesProtectionComplete = measlesProtectionComplete;
  }

  public boolean isVaccinationPassNotPresented() {
    return vaccinationPassNotPresented;
  }

  public void setVaccinationPassNotPresented(boolean vaccinationPassNotPresented) {
    this.vaccinationPassNotPresented = vaccinationPassNotPresented;
  }

  public boolean isMeaslesContraIndication() {
    return measlesContraIndication;
  }

  public void setMeaslesContraIndication(boolean measlesContraIndication) {
    this.measlesContraIndication = measlesContraIndication;
  }

  public SchoolInfoLetterMeaslesContraIndicationDuration getMeaslesContraIndicationDuration() {
    return measlesContraIndicationDuration;
  }

  public void setMeaslesContraIndicationDuration(
      SchoolInfoLetterMeaslesContraIndicationDuration measlesContraIndication) {
    this.measlesContraIndicationDuration = measlesContraIndication;
  }

  public LocalDate getMeaslesContraIndicationUntil() {
    return measlesContraIndicationUntil;
  }

  public void setMeaslesContraIndicationUntil(LocalDate measlesContraIndicationUntil) {
    this.measlesContraIndicationUntil = measlesContraIndicationUntil;
  }
}
