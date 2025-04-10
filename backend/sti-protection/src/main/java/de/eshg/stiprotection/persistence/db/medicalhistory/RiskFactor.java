/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class RiskFactor {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean riskActivityDateVaginalIntercourse;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean riskActivityDateOralIntercourse;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean riskActivityDateAnalIntercourse;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean otherRiskActivities;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate riskActivityDateVaginalIntercourseDate;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate riskActivityDateOralIntercourseDate;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate riskActivityDateAnalIntercourseDate;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String otherRiskActivitiesData;

  public Boolean getRiskActivityDateVaginalIntercourse() {
    return riskActivityDateVaginalIntercourse;
  }

  public void setRiskActivityDateVaginalIntercourse(Boolean riskActivityDateVaginalIntercourse) {
    this.riskActivityDateVaginalIntercourse = riskActivityDateVaginalIntercourse;
  }

  public Boolean getRiskActivityDateOralIntercourse() {
    return riskActivityDateOralIntercourse;
  }

  public void setRiskActivityDateOralIntercourse(Boolean riskActivityDateOralIntercourse) {
    this.riskActivityDateOralIntercourse = riskActivityDateOralIntercourse;
  }

  public Boolean getRiskActivityDateAnalIntercourse() {
    return riskActivityDateAnalIntercourse;
  }

  public void setRiskActivityDateAnalIntercourse(Boolean riskActivityDateAnalIntercourse) {
    this.riskActivityDateAnalIntercourse = riskActivityDateAnalIntercourse;
  }

  public Boolean getOtherRiskActivities() {
    return otherRiskActivities;
  }

  public void setOtherRiskActivities(Boolean otherRiskActivities) {
    this.otherRiskActivities = otherRiskActivities;
  }

  public LocalDate getRiskActivityDateVaginalIntercourseDate() {
    return riskActivityDateVaginalIntercourseDate;
  }

  public void setRiskActivityDateVaginalIntercourseDate(
      LocalDate riskActivityDateVaginalIntercourseDate) {
    this.riskActivityDateVaginalIntercourseDate = riskActivityDateVaginalIntercourseDate;
  }

  public LocalDate getRiskActivityDateOralIntercourseDate() {
    return riskActivityDateOralIntercourseDate;
  }

  public void setRiskActivityDateOralIntercourseDate(
      LocalDate riskActivityDateOralIntercourseDate) {
    this.riskActivityDateOralIntercourseDate = riskActivityDateOralIntercourseDate;
  }

  public LocalDate getRiskActivityDateAnalIntercourseDate() {
    return riskActivityDateAnalIntercourseDate;
  }

  public void setRiskActivityDateAnalIntercourseDate(
      LocalDate riskActivityDateAnalIntercourseDate) {
    this.riskActivityDateAnalIntercourseDate = riskActivityDateAnalIntercourseDate;
  }

  public String getOtherRiskActivitiesData() {
    return otherRiskActivitiesData;
  }

  public void setOtherRiskActivitiesData(String otherRiskActivitiesData) {
    this.otherRiskActivitiesData = otherRiskActivitiesData;
  }
}
