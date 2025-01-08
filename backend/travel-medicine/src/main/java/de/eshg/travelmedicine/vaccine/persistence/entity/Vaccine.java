/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "disease_id"))
@DataSensitivity(SensitivityLevel.PUBLIC)
public class Vaccine extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  private String name;

  @ManyToOne(optional = false)
  @JoinColumn(name = "disease_id")
  private Disease disease;

  @NotNull private List<Integer> offsets = new ArrayList<>();

  @Column(precision = 8, scale = 2)
  @NotNull
  @PositiveOrZero
  private BigDecimal fee;

  @Column @NotNull private UUID inventoryVaccineId;

  @NotNull @CreatedDate private Instant createdAt;

  @NotNull @LastModifiedDate private Instant modifiedAt;

  @Column private UUID modifiedBy;

  private String currentBatchId;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Disease getDisease() {
    return disease;
  }

  public void setDisease(Disease disease) {
    this.disease = disease;
  }

  public List<Integer> getOffsets() {
    return offsets;
  }

  public void setOffsets(List<Integer> offsets) {
    this.offsets = offsets;
  }

  public BigDecimal getFee() {
    return fee;
  }

  public void setFee(BigDecimal fee) {
    this.fee = fee;
  }

  public UUID getInventoryVaccineId() {
    return inventoryVaccineId;
  }

  public void setInventoryVaccineId(UUID inventoryVaccineId) {
    this.inventoryVaccineId = inventoryVaccineId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public String getCurrentBatchId() {
    return currentBatchId;
  }

  public void setCurrentBatchId(String currentBatchId) {
    this.currentBatchId = currentBatchId;
  }
}
