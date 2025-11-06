/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "inspection_id"))
public class InspectionSample extends BaseEntity {
  @Column(nullable = false, unique = true)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID sampleExternalId;

  @NotNull
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id", nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String pointOfWithdrawal; // Entnahmestelle

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleType typeOfSample; // Art der Probe

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameOfSamplingPoint; // Name der Probenahmestelle

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleEvaluationType evaluationType; // Auswertungsart (vor Ort/Labor)

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleActorReference samplingActor; // Benutzer ID des Probenehmers

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant timeOfSampling; // Zeitpunkt der Probenahme

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private InspectionSampleActorReference
      evaluatingActor; // Benutzer ID des Auswerters (Amtsmitarbeiter, Labor oder Einrichtung)

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant modifiedAt;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant timeOfEvaluation; // Zeitpunkt der Auswertung

  @OneToMany(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @NotNull
  @OrderBy
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<InspectionSampleMeasurementParameter> measurementParameters =
      new ArrayList<>(); // Messparameter

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String label; // Probenahmenlabel

  public @NotNull UUID getSampleExternalId() {
    return sampleExternalId;
  }

  public void setSampleExternalId(@NotNull UUID sampleExternalId) {
    this.sampleExternalId = sampleExternalId;
  }

  public @NotNull Inspection getInspection() {
    return inspection;
  }

  public void setInspection(@NotNull Inspection inspection) {
    this.inspection = inspection;
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

  public InspectionSampleActorReference getSamplingActor() {
    return samplingActor;
  }

  public void setSamplingActor(InspectionSampleActorReference samplingActor) {
    this.samplingActor = samplingActor;
  }

  public Instant getTimeOfSampling() {
    return timeOfSampling;
  }

  public void setTimeOfSampling(Instant timeOfSampling) {
    this.timeOfSampling = timeOfSampling;
  }

  public InspectionSampleActorReference getEvaluatingActor() {
    return evaluatingActor;
  }

  public void setEvaluatingActor(InspectionSampleActorReference evaluatingActor) {
    this.evaluatingActor = evaluatingActor;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public Instant getTimeOfEvaluation() {
    return timeOfEvaluation;
  }

  public void setTimeOfEvaluation(Instant timeOfEvaluation) {
    this.timeOfEvaluation = timeOfEvaluation;
  }

  public @NotNull List<InspectionSampleMeasurementParameter> getMeasurementParameters() {
    return measurementParameters;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public void addMeasurementParameter(InspectionSampleMeasurementParameter measurementParameter) {
    measurementParameter.setSampleExternalId(sampleExternalId);
    measurementParameters.add(measurementParameter);
  }
}
