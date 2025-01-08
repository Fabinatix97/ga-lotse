/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "inventory_item_id"))
public class InventoryItemBooking extends BaseEntity {
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ManyToOne
  @JoinColumn(name = "inventory_item_id")
  private InventoryItem inventoryItem;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private InventoryBookingStatus status;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private InventoryBookingType type;

  @CreatedBy
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private UUID bookedBy;

  @CreatedDate
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private Instant bookedAt;

  @Min(0)
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private int amount;

  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private UUID ownerKey;

  public InventoryItem getInventoryItem() {
    return inventoryItem;
  }

  public void setInventoryItem(InventoryItem inventoryItem) {
    this.inventoryItem = inventoryItem;
  }

  public InventoryBookingStatus getStatus() {
    return status;
  }

  public void setStatus(InventoryBookingStatus status) {
    this.status = status;
  }

  public InventoryBookingType getType() {
    return type;
  }

  public void setType(InventoryBookingType type) {
    this.type = type;
  }

  public UUID getBookedBy() {
    return bookedBy;
  }

  public void setBookedBy(UUID bookedBy) {
    this.bookedBy = bookedBy;
  }

  public Instant getBookedAt() {
    return bookedAt;
  }

  public void setBookedAt(Instant bookedAt) {
    this.bookedAt = bookedAt;
  }

  public int getAmount() {
    return amount;
  }

  public void setAmount(int amount) {
    this.amount = amount;
  }

  public UUID getOwnerKey() {
    return ownerKey;
  }

  public void setOwnerKey(UUID ownerKey) {
    this.ownerKey = ownerKey;
  }
}
