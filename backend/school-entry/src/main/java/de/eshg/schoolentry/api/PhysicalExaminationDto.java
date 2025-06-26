/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PhysicalExamination", description = "Physical examination results.")
public final class PhysicalExaminationDto {
  private @Valid @NotNull @Schema(description = "Diagnosis related to nutritional condition.")
  ExaminationWithDiagnosisDto nutritionalCondition;
  private @Valid @NotNull @Schema(description = "Diagnosis related to neurology.")
  ExaminationWithDiagnosisDto neurology;
  private @Valid @NotNull @Schema(
      description = "Diagnosis related to respiratory and cardiovascular system.")
  ExaminationWithDiagnosisDto respiratoryCardiovascular;
  private @Valid @NotNull @Schema(description = "Diagnosis related to skin appearance.")
  ExaminationWithDiagnosisDto skin;
  private @Valid @NotNull @Schema(description = "Diagnosis related to musculature and skeleton.")
  ExaminationWithDiagnosisDto musculatureSkeleton;
  private @Valid @NotNull @Schema(description = "Diagnosis related to metabolism.")
  ExaminationWithDiagnosisDto metabolism;
  private @Valid @NotNull @Schema(description = "Diagnosis related to abdomen.")
  ExaminationWithDiagnosisDto abdomen;
  private @Valid @NotNull @Schema(description = "Diagnosis related to ear, nose, and throat.")
  ExaminationWithDiagnosisDto earNoseThroat;
  private @Schema(description = "Additional note for the physical examination.") String note;

  public PhysicalExaminationDto(
      ExaminationWithDiagnosisDto nutritionalCondition,
      ExaminationWithDiagnosisDto neurology,
      ExaminationWithDiagnosisDto respiratoryCardiovascular,
      ExaminationWithDiagnosisDto skin,
      ExaminationWithDiagnosisDto musculatureSkeleton,
      ExaminationWithDiagnosisDto metabolism,
      ExaminationWithDiagnosisDto abdomen,
      ExaminationWithDiagnosisDto earNoseThroat,
      String note) {
    this.nutritionalCondition = nutritionalCondition;
    this.neurology = neurology;
    this.respiratoryCardiovascular = respiratoryCardiovascular;
    this.skin = skin;
    this.musculatureSkeleton = musculatureSkeleton;
    this.metabolism = metabolism;
    this.abdomen = abdomen;
    this.earNoseThroat = earNoseThroat;
    this.note = note;
  }

  public ExaminationWithDiagnosisDto getNutritionalCondition() {
    return nutritionalCondition;
  }

  public void setNutritionalCondition(ExaminationWithDiagnosisDto nutritionalCondition) {
    this.nutritionalCondition = nutritionalCondition;
  }

  public ExaminationWithDiagnosisDto getNeurology() {
    return neurology;
  }

  public void setNeurology(ExaminationWithDiagnosisDto neurology) {
    this.neurology = neurology;
  }

  public ExaminationWithDiagnosisDto getRespiratoryCardiovascular() {
    return respiratoryCardiovascular;
  }

  public void setRespiratoryCardiovascular(ExaminationWithDiagnosisDto respiratoryCardiovascular) {
    this.respiratoryCardiovascular = respiratoryCardiovascular;
  }

  public ExaminationWithDiagnosisDto getSkin() {
    return skin;
  }

  public void setSkin(ExaminationWithDiagnosisDto skin) {
    this.skin = skin;
  }

  public ExaminationWithDiagnosisDto getMusculatureSkeleton() {
    return musculatureSkeleton;
  }

  public void setMusculatureSkeleton(ExaminationWithDiagnosisDto musculatureSkeleton) {
    this.musculatureSkeleton = musculatureSkeleton;
  }

  public ExaminationWithDiagnosisDto getMetabolism() {
    return metabolism;
  }

  public void setMetabolism(ExaminationWithDiagnosisDto metabolism) {
    this.metabolism = metabolism;
  }

  public ExaminationWithDiagnosisDto getAbdomen() {
    return abdomen;
  }

  public void setAbdomen(ExaminationWithDiagnosisDto abdomen) {
    this.abdomen = abdomen;
  }

  public ExaminationWithDiagnosisDto getEarNoseThroat() {
    return earNoseThroat;
  }

  public void setEarNoseThroat(ExaminationWithDiagnosisDto earNoseThroat) {
    this.earNoseThroat = earNoseThroat;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
