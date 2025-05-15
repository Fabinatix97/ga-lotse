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

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SchoolInfoLetterHearingExaminationInfo extends BaseEntity {
  @OneToOne(optional = false)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  private boolean conspicuous;
  private boolean clarificationArranged;
  private boolean underTreatment;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public boolean isConspicuous() {
    return conspicuous;
  }

  public void setConspicuous(boolean conspicuous) {
    this.conspicuous = conspicuous;
  }

  public boolean isClarificationArranged() {
    return clarificationArranged;
  }

  public void setClarificationArranged(boolean clarificationArranged) {
    this.clarificationArranged = clarificationArranged;
  }

  public boolean isUnderTreatment() {
    return underTreatment;
  }

  public void setUnderTreatment(boolean underTreatment) {
    this.underTreatment = underTreatment;
  }
}
