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
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SchoolInfoLetterTherapyAndPromotionInfo extends BaseEntity {
  @OneToOne(optional = false)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  private boolean speechTherapy;
  private boolean ergoTherapy;
  private boolean physioTherapy;
  private boolean psychoMotorSkills;
  private boolean miscellaneous;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public boolean isSpeechTherapy() {
    return speechTherapy;
  }

  public void setSpeechTherapy(boolean speechTherapy) {
    this.speechTherapy = speechTherapy;
  }

  public boolean isErgoTherapy() {
    return ergoTherapy;
  }

  public void setErgoTherapy(boolean ergoTherapy) {
    this.ergoTherapy = ergoTherapy;
  }

  public boolean isPhysioTherapy() {
    return physioTherapy;
  }

  public void setPhysioTherapy(boolean physioTherapy) {
    this.physioTherapy = physioTherapy;
  }

  public boolean isPsychoMotorSkills() {
    return psychoMotorSkills;
  }

  public void setPsychoMotorSkills(boolean psychoMotorSkills) {
    this.psychoMotorSkills = psychoMotorSkills;
  }

  public boolean isMiscellaneous() {
    return miscellaneous;
  }

  public void setMiscellaneous(boolean miscellaneous) {
    this.miscellaneous = miscellaneous;
  }
}
