/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Entity
public class StiProtectionAppointmentStandardDuration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  boolean hivStiConsultationInitialized = true;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  boolean sexWorkConsultationInitialized = true;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration hivStiConsultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration sexWorkConsultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private Duration resultsReview;

  public boolean isHivStiConsultationInitialized() {
    return hivStiConsultationInitialized;
  }

  public void setHivStiConsultationInitialized(boolean stiConsultationInitialized) {
    this.hivStiConsultationInitialized = stiConsultationInitialized;
  }

  public boolean isSexWorkConsultationInitialized() {
    return sexWorkConsultationInitialized;
  }

  public void setSexWorkConsultationInitialized(boolean sexWorkInitialized) {
    this.sexWorkConsultationInitialized = sexWorkInitialized;
  }

  public Duration getHivStiConsultation() {
    return hivStiConsultation;
  }

  public void setHivStiConsultation(Duration hivStiConsultation) {
    this.hivStiConsultation = hivStiConsultation;
  }

  public Duration getSexWorkConsultation() {
    return sexWorkConsultation;
  }

  public void setSexWorkConsultation(Duration sexWork) {
    this.sexWorkConsultation = sexWork;
  }

  public Duration getResultsReview() {
    return resultsReview;
  }

  public void setResultsReview(Duration resultsReview) {
    this.resultsReview = resultsReview;
  }
}
