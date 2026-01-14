/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model.schoolinfoletter;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
public class SchoolInfoLetterParentsWish extends BaseEntity {
  @OneToOne(optional = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String note;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean referredToFurtherConsultationFromSchool;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public boolean isReferredToFurtherConsultationFromSchool() {
    return referredToFurtherConsultationFromSchool;
  }

  public void setReferredToFurtherConsultationFromSchool(
      boolean referredToFurtherConsultationFromSchool) {
    this.referredToFurtherConsultationFromSchool = referredToFurtherConsultationFromSchool;
  }
}
