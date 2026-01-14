/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DiscriminatorValue("VACCINATION")
public class Vaccination extends VcService {

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  private String diseaseName;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  private String vaccineName;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  private UUID inventoryVaccineId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private VaccinationType vaccinationType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Min(1)
  private int vaccinationNumber;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private Integer latency;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String batchIdentifier;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String defaultBatchIdentifier;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Long bookingId;

  public Vaccination() {}

  public Vaccination(
      VaccinationConsultation vaccinationConsultation,
      String diseaseName,
      String vaccineName,
      UUID inventoryId,
      BigDecimal fee,
      VaccinationType vaccinationType,
      int vaccinationNumber,
      Integer latency,
      String defaultBatchIdentifier) {
    super(vaccinationConsultation, fee);
    this.diseaseName = diseaseName;
    this.vaccineName = vaccineName;
    this.inventoryVaccineId = inventoryId;
    this.vaccinationType = vaccinationType;
    this.vaccinationNumber = vaccinationNumber;
    this.batchIdentifier = null;
    this.bookingId = null;
    this.latency = latency;
    this.defaultBatchIdentifier = defaultBatchIdentifier;
  }

  public String getDiseaseName() {
    return diseaseName;
  }

  public void setDiseaseName(String diseaseName) {
    this.diseaseName = diseaseName;
  }

  public String getVaccineName() {
    return vaccineName;
  }

  public void setVaccineName(String vaccineName) {
    this.vaccineName = vaccineName;
  }

  public UUID getInventoryVaccineId() {
    return inventoryVaccineId;
  }

  public void setInventoryVaccineId(UUID inventoryVaccineId) {
    this.inventoryVaccineId = inventoryVaccineId;
  }

  public VaccinationType getVaccinationType() {
    return vaccinationType;
  }

  public void setVaccinationType(VaccinationType vaccinationType) {
    this.vaccinationType = vaccinationType;
  }

  public int getVaccinationNumber() {
    return vaccinationNumber;
  }

  public void setVaccinationNumber(int vaccinationNumber) {
    this.vaccinationNumber = vaccinationNumber;
  }

  public Integer getLatency() {
    return latency;
  }

  public void setLatency(Integer latency) {
    this.latency = latency;
  }

  public String getBatchIdentifier() {
    return batchIdentifier;
  }

  public void setBatchIdentifier(String batchIdentifier) {
    this.batchIdentifier = batchIdentifier;
  }

  public String getDefaultBatchIdentifier() {
    return defaultBatchIdentifier;
  }

  public void setDefaultBatchIdentifier(String defaultBatchIdentifier) {
    this.defaultBatchIdentifier = defaultBatchIdentifier;
  }

  public Long getBookingId() {
    return bookingId;
  }

  public void setBookingId(Long bookingId) {
    this.bookingId = bookingId;
  }
}
