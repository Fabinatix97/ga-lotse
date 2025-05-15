/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model.schoolinfoletter;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class SchoolInfoLetterPhysiciansRecommendation extends BaseEntity {
  @OneToOne(optional = false)
  private SchoolInfoLetterExamination schoolInfoLetterExamination;

  private boolean concernsCanChild;
  private boolean specialPromotion;
  private boolean introductionInBFZ;
  private boolean promotionOutsideSchool;
  private boolean furtherMeasures;

  @Column(name = "meeting_recommended", nullable = false)
  private boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended;

  public SchoolInfoLetterExamination getSchoolInfoLetterExamination() {
    return schoolInfoLetterExamination;
  }

  public void setSchoolInfoLetterExamination(
      SchoolInfoLetterExamination schoolInfoLetterExamination) {
    this.schoolInfoLetterExamination = schoolInfoLetterExamination;
  }

  public boolean isConcernsCanChild() {
    return concernsCanChild;
  }

  public void setConcernsCanChild(boolean concernsCanChild) {
    this.concernsCanChild = concernsCanChild;
  }

  public boolean isSpecialPromotion() {
    return specialPromotion;
  }

  public void setSpecialPromotion(boolean specialPromotion) {
    this.specialPromotion = specialPromotion;
  }

  public boolean isIntroductionInBFZ() {
    return introductionInBFZ;
  }

  public void setIntroductionInBFZ(boolean introductionInBFZ) {
    this.introductionInBFZ = introductionInBFZ;
  }

  public boolean isPromotionOutsideSchool() {
    return promotionOutsideSchool;
  }

  public void setPromotionOutsideSchool(boolean promotionOutsideSchool) {
    this.promotionOutsideSchool = promotionOutsideSchool;
  }

  public boolean isFurtherMeasures() {
    return furtherMeasures;
  }

  public void setFurtherMeasures(boolean furtherMeasures) {
    this.furtherMeasures = furtherMeasures;
  }

  public boolean isMeetingBetweenYouthHealthServicesAndSchoolManagementRecommended() {
    return meetingBetweenYouthHealthServicesAndSchoolManagementRecommended;
  }

  public void setMeetingBetweenYouthHealthServicesAndSchoolManagementRecommended(
      boolean meetingBetweenYouthHealthServicesAndSchoolManagementRecommended) {
    this.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended =
        meetingBetweenYouthHealthServicesAndSchoolManagementRecommended;
  }
}
