/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InspectionSampleTemplate extends GloballyUniqueEntityBase {
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  String name;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String pointOfWithdrawal;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleType typeOfSample;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameOfSamplingPoint;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleEvaluationType evaluationType;

  @OneToMany(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @NotNull
  @OrderBy
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<InspectionSampleMeasurementParameterTemplate> measurementParameters =
      new ArrayList<>();

  public @NotNull String getName() {
    return name;
  }

  public void setName(@NotNull String name) {
    this.name = name;
  }

  public @NotNull String getPointOfWithdrawal() {
    return pointOfWithdrawal;
  }

  public void setPointOfWithdrawal(@NotNull String pointOfWithdrawal) {
    this.pointOfWithdrawal = pointOfWithdrawal;
  }

  public @NotNull InspectionSampleType getTypeOfSample() {
    return typeOfSample;
  }

  public void setTypeOfSample(@NotNull InspectionSampleType typeOfSample) {
    this.typeOfSample = typeOfSample;
  }

  public String getNameOfSamplingPoint() {
    return nameOfSamplingPoint;
  }

  public void setNameOfSamplingPoint(String nameOfSamplingPoint) {
    this.nameOfSamplingPoint = nameOfSamplingPoint;
  }

  public @NotNull InspectionSampleEvaluationType getEvaluationType() {
    return evaluationType;
  }

  public void setEvaluationType(@NotNull InspectionSampleEvaluationType evaluationType) {
    this.evaluationType = evaluationType;
  }

  public @NotNull List<InspectionSampleMeasurementParameterTemplate> getMeasurementParameters() {
    return measurementParameters;
  }
}
