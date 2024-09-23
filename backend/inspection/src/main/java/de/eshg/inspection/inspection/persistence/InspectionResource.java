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
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(indexes = @Index(columnList = "inspection_id"))
@EntityListeners(AuditingEntityListener.class)
public class InspectionResource extends GloballyUniqueEntityBase {

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @Column(name = "base_resource_id", nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID baseResourceId;

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

  @Column(unique = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID calendarEventId;

  public InspectionResource() {}

  public InspectionResource(Inspection inspection, UUID baseResourceId, UUID modifiedBy) {
    this.inspection = inspection;
    this.baseResourceId = baseResourceId;
    this.modifiedBy = modifiedBy;
  }

  public Inspection getInspection() {
    return inspection;
  }

  public UUID getBaseResourceId() {
    return baseResourceId;
  }

  public void setBaseResourceId(UUID baseInventoryId) {
    this.baseResourceId = baseInventoryId;
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

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }
}
