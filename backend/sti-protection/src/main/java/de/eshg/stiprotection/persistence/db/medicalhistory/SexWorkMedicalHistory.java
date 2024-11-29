/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import java.time.LocalDate;

@Entity
@DataSensitivity(SensitivityLevel.UNDEFINED)
@DiscriminatorValue(value = "SEX_WORK")
public class SexWorkMedicalHistory extends MedicalHistory {

  private LocalDate lastMenstruationDate;

  private LocalDate lastCancerScreeningDate;

  private Boolean previouslyPregnant;

  private Integer amountPregnancies;

  private Integer amountAbortions;

  private String knownOperations;

  private String medications;

  @Embedded private SexWorkRiskContact sexWorkRiskContacts;

  public LocalDate getLastMenstruationDate() {
    return lastMenstruationDate;
  }

  public void setLastMenstruationDate(LocalDate lastMenstruationDate) {
    this.lastMenstruationDate = lastMenstruationDate;
  }

  public LocalDate getLastCancerScreeningDate() {
    return lastCancerScreeningDate;
  }

  public void setLastCancerScreeningDate(LocalDate lastCancerScreeningDate) {
    this.lastCancerScreeningDate = lastCancerScreeningDate;
  }

  public Boolean getPreviouslyPregnant() {
    return previouslyPregnant;
  }

  public void setPreviouslyPregnant(Boolean previouslyPregnant) {
    this.previouslyPregnant = previouslyPregnant;
  }

  public Integer getAmountPregnancies() {
    return amountPregnancies;
  }

  public void setAmountPregnancies(Integer amountPregnancies) {
    this.amountPregnancies = amountPregnancies;
  }

  public Integer getAmountAbortions() {
    return amountAbortions;
  }

  public void setAmountAbortions(Integer amountAbortions) {
    this.amountAbortions = amountAbortions;
  }

  public String getKnownOperations() {
    return knownOperations;
  }

  public void setKnownOperations(String knownOperations) {
    this.knownOperations = knownOperations;
  }

  public String getMedications() {
    return medications;
  }

  public void setMedications(String medications) {
    this.medications = medications;
  }

  public SexWorkRiskContact getSexWorkRiskContacts() {
    return sexWorkRiskContacts;
  }

  public void setSexWorkRiskContacts(SexWorkRiskContact sexWorkRiskContacts) {
    this.sexWorkRiskContacts = sexWorkRiskContacts;
  }
}
