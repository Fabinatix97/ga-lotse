/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(indexes = @Index(columnList = "inspection_id"))
@EntityListeners(AuditingEntityListener.class)
public class InspectionInventory extends GloballyUniqueEntityBase {

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @Column(name = "base_inventory_id", nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID baseInventoryId;

  @Column(nullable = false)
  @NotNull
  @PositiveOrZero
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Integer count;

  @Column
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID modifiedBy;

  @Column(nullable = false)
  @CreatedDate
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant createdAt;

  @Column(nullable = false)
  @LastModifiedDate
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant modifiedAt;

  @NotNull
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  Long bookingId;

  @NotNull
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  UUID ownerKey;

  public InspectionInventory() {}

  public InspectionInventory(
      Inspection inspection, UUID baseInventoryId, int count, UUID modifiedBy) {
    this.inspection = inspection;
    this.baseInventoryId = baseInventoryId;
    this.count = count;
    this.modifiedBy = modifiedBy;
  }

  public Inspection getInspection() {
    return inspection;
  }

  public UUID getBaseInventoryId() {
    return baseInventoryId;
  }

  public void setBaseInventoryId(UUID baseInventoryId) {
    this.baseInventoryId = baseInventoryId;
  }

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public long getBookingId() {
    return bookingId;
  }

  public void setBookingId(long bookingId) {
    this.bookingId = bookingId;
  }

  public UUID getOwnerKey() {
    return ownerKey;
  }

  public void setOwnerKey(UUID ownerKey) {
    this.ownerKey = ownerKey;
  }
}
