/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.teis.persistence.TeisParameter;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameter;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(
    indexes = {
      @Index(columnList = "teis_parameter_zid"),
      @Index(columnList = "teis_untersuchungsparameter_zid")
    })
public class InspectionSampleMeasurementParameter extends BaseEntity {
  @Column(nullable = false, unique = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID sampleExternalId;

  @Column(nullable = false, unique = true)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID measurementParameterExternalId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @NotNull
  @JoinColumn(name = "teis_parameter_zid")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  TeisParameter teisParameter;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "teis_untersuchungsparameter_zid")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  TeisUntersuchungsparameter teisUntersuchungsparameter;

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

  public @NotNull TeisParameter getTeisParameter() {
    return teisParameter;
  }

  public void setTeisParameter(@NotNull TeisParameter teisParameter) {
    this.teisParameter = teisParameter;
  }

  public TeisUntersuchungsparameter getTeisUntersuchungsparameter() {
    return teisUntersuchungsparameter;
  }

  public void setTeisUntersuchungsparameter(TeisUntersuchungsparameter teisUntersuchungsparameter) {
    this.teisUntersuchungsparameter = teisUntersuchungsparameter;
  }
}
