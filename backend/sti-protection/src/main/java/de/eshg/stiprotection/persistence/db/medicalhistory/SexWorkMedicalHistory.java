/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDate;

@Entity
@DataSensitivity(SensitivityLevel.UNDEFINED)
@DiscriminatorValue(value = "SEX_WORK")
public class SexWorkMedicalHistory extends MedicalHistory {

  private LocalDate lastMenstruationDuration;

  private LocalDate lastCancerScreeningDuration;

  private Integer amountPregnancies;

  private Integer amountAbortions;

  private String knownOperations;

  private String medications;

  public LocalDate getLastMenstruationDuration() {
    return lastMenstruationDuration;
  }

  public void setLastMenstruationDuration(LocalDate lastMenstruationDuration) {
    this.lastMenstruationDuration = lastMenstruationDuration;
  }

  public LocalDate getLastCancerScreeningDuration() {
    return lastCancerScreeningDuration;
  }

  public void setLastCancerScreeningDuration(LocalDate lastCancerScreeningDuration) {
    this.lastCancerScreeningDuration = lastCancerScreeningDuration;
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
}
