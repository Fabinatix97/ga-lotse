/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.consultation;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class GeneralSection {

  private String mainReason;
  private String furtherGenderInfo;
  private Boolean hasSufficientGermanLanguageSkills;
  private Boolean isIlliterate;
  private String otherKnownLanguages;
  private Boolean hasHealthInsurance;
  private Boolean hasGermanHealthInsurance;
  private Boolean hasInsecureResidence;
  private Boolean hasSymptoms;
  private String symptoms;
  private String drugUse;
  private String referral;
  private String notes;

  public String getMainReason() {
    return mainReason;
  }

  public void setMainReason(String mainReason) {
    this.mainReason = mainReason;
  }

  public String getFurtherGenderInfo() {
    return furtherGenderInfo;
  }

  public void setFurtherGenderInfo(String furtherGenderInfo) {
    this.furtherGenderInfo = furtherGenderInfo;
  }

  public Boolean getHasSufficientGermanLanguageSkills() {
    return hasSufficientGermanLanguageSkills;
  }

  public void setHasSufficientGermanLanguageSkills(Boolean hasSufficientGermanLanguageSkills) {
    this.hasSufficientGermanLanguageSkills = hasSufficientGermanLanguageSkills;
  }

  public Boolean getIsIlliterate() {
    return isIlliterate;
  }

  public void setIsIlliterate(Boolean isIlliterate) {
    this.isIlliterate = isIlliterate;
  }

  public String getOtherKnownLanguages() {
    return otherKnownLanguages;
  }

  public void setOtherKnownLanguages(String otherKnownLanguages) {
    this.otherKnownLanguages = otherKnownLanguages;
  }

  public Boolean getHasHealthInsurance() {
    return hasHealthInsurance;
  }

  public void setHasHealthInsurance(Boolean hasHealthInsurance) {
    this.hasHealthInsurance = hasHealthInsurance;
  }

  public Boolean getHasGermanHealthInsurance() {
    return hasGermanHealthInsurance;
  }

  public void setHasGermanHealthInsurance(Boolean hasGermanHealthInsurance) {
    this.hasGermanHealthInsurance = hasGermanHealthInsurance;
  }

  public Boolean getHasInsecureResidence() {
    return hasInsecureResidence;
  }

  public void setHasInsecureResidence(Boolean hasInsecureResidence) {
    this.hasInsecureResidence = hasInsecureResidence;
  }

  public Boolean getHasSymptoms() {
    return hasSymptoms;
  }

  public void setHasSymptoms(Boolean hasSymptoms) {
    this.hasSymptoms = hasSymptoms;
  }

  public String getSymptoms() {
    return symptoms;
  }

  public void setSymptoms(String symptoms) {
    this.symptoms = symptoms;
  }

  public String getDrugUse() {
    return drugUse;
  }

  public void setDrugUse(String drugUse) {
    this.drugUse = drugUse;
  }

  public String getReferral() {
    return referral;
  }

  public void setReferral(String referral) {
    this.referral = referral;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
