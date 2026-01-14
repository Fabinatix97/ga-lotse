/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.consultation;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class PregnancySection {

  private Boolean hasPregnancyRelatedInfo;
  private LocalDate lastCytologyTest;
  private LocalDate startOfLastPeriod;
  private Integer numberOfPregnancies;
  private Integer numberOfInducedAbortions;
  private Integer numberOfBirths;
  private Integer numberOfOtherAbortions;
  private Integer numberOfEctopicPregnancies;

  public Boolean getHasPregnancyRelatedInfo() {
    return hasPregnancyRelatedInfo;
  }

  public void setHasPregnancyRelatedInfo(Boolean hasPregnancyRelatedInfo) {
    this.hasPregnancyRelatedInfo = hasPregnancyRelatedInfo;
  }

  public LocalDate getLastCytologyTest() {
    return lastCytologyTest;
  }

  public void setLastCytologyTest(LocalDate lastCytologyTest) {
    this.lastCytologyTest = lastCytologyTest;
  }

  public LocalDate getStartOfLastPeriod() {
    return startOfLastPeriod;
  }

  public void setStartOfLastPeriod(LocalDate startOfLastPeriod) {
    this.startOfLastPeriod = startOfLastPeriod;
  }

  public Integer getNumberOfPregnancies() {
    return numberOfPregnancies;
  }

  public void setNumberOfPregnancies(Integer numberOfPregnancies) {
    this.numberOfPregnancies = numberOfPregnancies;
  }

  public Integer getNumberOfInducedAbortions() {
    return numberOfInducedAbortions;
  }

  public void setNumberOfInducedAbortions(Integer numberOfInducedAbortions) {
    this.numberOfInducedAbortions = numberOfInducedAbortions;
  }

  public Integer getNumberOfBirths() {
    return numberOfBirths;
  }

  public void setNumberOfBirths(Integer numberOfBirths) {
    this.numberOfBirths = numberOfBirths;
  }

  public Integer getNumberOfOtherAbortions() {
    return numberOfOtherAbortions;
  }

  public void setNumberOfOtherAbortions(Integer numberOfOtherAbortions) {
    this.numberOfOtherAbortions = numberOfOtherAbortions;
  }

  public Integer getNumberOfEctopicPregnancies() {
    return numberOfEctopicPregnancies;
  }

  public void setNumberOfEctopicPregnancies(Integer numberOfEctopicPregnancies) {
    this.numberOfEctopicPregnancies = numberOfEctopicPregnancies;
  }
}
