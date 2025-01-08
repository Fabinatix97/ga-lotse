/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class OtherServiceTemplate extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  private String description;

  @Column(precision = 8, scale = 2)
  @PositiveOrZero
  private BigDecimal fee;

  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  public OtherServiceTemplate() {}

  public OtherServiceTemplate(UUID id, String description, BigDecimal estimatedFee) {
    this.id = id;
    this.description = description;
    this.fee = estimatedFee;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String name) {
    this.description = name;
  }

  public BigDecimal getFee() {
    return fee;
  }

  public void setFee(BigDecimal estimatedFee) {
    this.fee = estimatedFee;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(@NotNull Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }
}
