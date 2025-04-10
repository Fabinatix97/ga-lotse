/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.consultation;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
public class GeneralSection {

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String mainReason;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String furtherGenderInfo;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String otherKnownLanguages;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hasHealthInsurance;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hasGermanHealthInsurance;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hasInsecureResidence;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hasSymptoms;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String symptoms;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String drugUse;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String referral;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
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
