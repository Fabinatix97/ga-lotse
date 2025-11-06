/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InspectionSampleMeasurementParameter extends BaseEntity {
  @Column(nullable = false, unique = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID sampleExternalId;

  @Column(nullable = false, unique = true)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID measurementParameterExternalId;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  String parameterName; // Parametername

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  String parameterGroup; // Parametergruppe (beispielsweise: Standardwassermessung nach DIN 38405)

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  Double measurementValue; // Messwert

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  InspectionSamplePreclassification preclassification =
      InspectionSamplePreclassification
          .PENDING; // Voreinordnung (zu niedrig, im Normbereich, zu hoch)

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  String userAssessment; // Benutzereinschätzung (Falls Wert außerhalb des Normbereichs liegt)

  public @NotNull UUID getSampleExternalId() {
    return sampleExternalId;
  }

  public void setSampleExternalId(@NotNull UUID sampleExternalId) {
    this.sampleExternalId = sampleExternalId;
  }

  public @NotNull UUID getMeasurementParameterExternalId() {
    return measurementParameterExternalId;
  }

  public void setMeasurementParameterExternalId(@NotNull UUID measurementParameterExternalId) {
    this.measurementParameterExternalId = measurementParameterExternalId;
  }

  public @NotNull String getParameterName() {
    return parameterName;
  }

  public void setParameterName(@NotNull String parameterName) {
    this.parameterName = parameterName;
  }

  public String getParameterGroup() {
    return parameterGroup;
  }

  public void setParameterGroup(String parameterGroup) {
    this.parameterGroup = parameterGroup;
  }

  public Double getMeasurementValue() {
    return measurementValue;
  }

  public void setMeasurementValue(Double measurementValue) {
    this.measurementValue = measurementValue;
  }

  public @NotNull InspectionSamplePreclassification getPreclassification() {
    return preclassification;
  }

  public void setPreclassification(@NotNull InspectionSamplePreclassification preclassification) {
    this.preclassification = preclassification;
  }

  public String getUserAssessment() {
    return userAssessment;
  }

  public void setUserAssessment(String userAssessment) {
    this.userAssessment = userAssessment;
  }
}
