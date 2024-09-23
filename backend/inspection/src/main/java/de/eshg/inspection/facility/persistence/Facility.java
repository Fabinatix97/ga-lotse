/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.persistence;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(indexes = @Index(columnList = "object_type_id"))
public class Facility extends BaseEntityWithExternalId {

  /** ID of this facility in the central file ("Sachstand-ID") */
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID centralFileStateId;

  /** Last Inspection Date, null if never inspected */
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column
  private Instant lastInspected;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean banned;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean suspicious;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean active;

  @ManyToOne
  @JoinColumn(name = "object_type_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ObjectType objectType;

  public Facility() {}

  public Facility(ObjectType objectType, UUID centralFileStateId) {
    this.objectType = objectType;
    this.centralFileStateId = centralFileStateId;
  }

  public UUID getCentralFileStateId() {
    return centralFileStateId;
  }

  public void setCentralFileStateId(UUID centralFileStateId) {
    this.centralFileStateId = centralFileStateId;
  }

  public boolean isBanned() {
    return banned;
  }

  public void setBanned(boolean banned) {
    this.banned = banned;
  }

  public boolean isSuspicious() {
    return suspicious;
  }

  public void setSuspicious(boolean suspicious) {
    this.suspicious = suspicious;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public ObjectType getObjectType() {
    return objectType;
  }

  public void setObjectType(ObjectType objectType) {
    this.objectType = objectType;
  }

  public Instant getLastInspected() {
    return lastInspected;
  }

  public void setLastInspected(Instant lastInspected) {
    this.lastInspected = lastInspected;
  }
}
