/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model.schoolinfoletter;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class SchoolInfoLetterExamination extends BaseEntity {
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterExaminationType examinationType;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean postponed;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterSchoolAndPromotionHints_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterSchoolAndPromotionHints schoolAndPromotionHints;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String note;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String customRecommendation;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterVaccinationInfo_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterVaccinationInfo vaccinationInfo;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterEyeExaminationInfo_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterEyeExaminationInfo eyeExaminationInfo;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterHearingExaminationInfo_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterHearingExaminationInfo hearingExaminationInfo;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean consultationWithCustodianRecommended;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterTherapyAndPromotionInfo_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterTherapyAndPromotionInfo therapyAndPromotionInfo;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterPhysiciansRecommendation_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterPhysiciansRecommendation physiciansRecommendation;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SchoolInfoLetterParentsWish_.SCHOOL_INFO_LETTER_EXAMINATION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private SchoolInfoLetterParentsWish parentsWish;

  public SchoolInfoLetterExaminationType getExaminationType() {
    return examinationType;
  }

  public void setExaminationType(SchoolInfoLetterExaminationType examinationType) {
    this.examinationType = examinationType;
  }

  public boolean isPostponed() {
    return postponed;
  }

  public void setPostponed(boolean postponed) {
    this.postponed = postponed;
  }

  public SchoolInfoLetterSchoolAndPromotionHints getSchoolAndPromotionHints() {
    return schoolAndPromotionHints;
  }

  public void setSchoolAndPromotionHints(
      SchoolInfoLetterSchoolAndPromotionHints schoolAndPromotionHints) {
    this.schoolAndPromotionHints = schoolAndPromotionHints;
    schoolAndPromotionHints.setSchoolInfoLetterExamination(this);
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public String getCustomRecommendation() {
    return customRecommendation;
  }

  public void setCustomRecommendation(String customRecommendation) {
    this.customRecommendation = customRecommendation;
  }

  public SchoolInfoLetterVaccinationInfo getVaccinationInfo() {
    return vaccinationInfo;
  }

  public void setVaccinationInfo(SchoolInfoLetterVaccinationInfo vaccinationInfo) {
    this.vaccinationInfo = vaccinationInfo;
    vaccinationInfo.setSchoolInfoLetterExamination(this);
  }

  public SchoolInfoLetterEyeExaminationInfo getEyeExaminationInfo() {
    return eyeExaminationInfo;
  }

  public void setEyeExaminationInfo(SchoolInfoLetterEyeExaminationInfo eyeExaminationInfo) {
    this.eyeExaminationInfo = eyeExaminationInfo;
    eyeExaminationInfo.setSchoolInfoLetterExamination(this);
  }

  public SchoolInfoLetterHearingExaminationInfo getHearingExaminationInfo() {
    return hearingExaminationInfo;
  }

  public void setHearingExaminationInfo(
      SchoolInfoLetterHearingExaminationInfo hearingExaminationInfo) {
    this.hearingExaminationInfo = hearingExaminationInfo;
    hearingExaminationInfo.setSchoolInfoLetterExamination(this);
  }

  public boolean isConsultationWithCustodianRecommended() {
    return consultationWithCustodianRecommended;
  }

  public void setConsultationWithCustodianRecommended(
      boolean consultationWithCustodianRecommended) {
    this.consultationWithCustodianRecommended = consultationWithCustodianRecommended;
  }

  public SchoolInfoLetterTherapyAndPromotionInfo getTherapyAndPromotionInfo() {
    return therapyAndPromotionInfo;
  }

  public void setTherapyAndPromotionInfo(
      SchoolInfoLetterTherapyAndPromotionInfo therapyAndPromotionInfo) {
    this.therapyAndPromotionInfo = therapyAndPromotionInfo;
    therapyAndPromotionInfo.setSchoolInfoLetterExamination(this);
  }

  public SchoolInfoLetterPhysiciansRecommendation getPhysiciansRecommendation() {
    return physiciansRecommendation;
  }

  public void setPhysiciansRecommendation(
      SchoolInfoLetterPhysiciansRecommendation physiciansRecommendation) {
    this.physiciansRecommendation = physiciansRecommendation;
    physiciansRecommendation.setSchoolInfoLetterExamination(this);
  }

  public SchoolInfoLetterParentsWish getParentsWish() {
    return parentsWish;
  }

  public void setParentsWish(SchoolInfoLetterParentsWish parentsWish) {
    this.parentsWish = parentsWish;
    parentsWish.setSchoolInfoLetterExamination(this);
  }
}
