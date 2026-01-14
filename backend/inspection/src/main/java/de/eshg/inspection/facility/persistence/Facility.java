/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
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
  private UUID originalCentralFileStateId;

  /** Last Inspection Date, null if never inspected */
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column
  private Instant lastInspected;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean banned;

  @ManyToOne
  @JoinColumn(name = "object_type_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ObjectType objectType;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean possibleDuplicates;

  public Facility() {}

  public Facility(ObjectType objectType, UUID originalCentralFileStateId) {
    this.objectType = objectType;
    this.originalCentralFileStateId = originalCentralFileStateId;
  }

  public UUID getOriginalCentralFileStateId() {
    return originalCentralFileStateId;
  }

  public void setOriginalCentralFileStateId(UUID centralFileStateId) {
    this.originalCentralFileStateId = centralFileStateId;
  }

  public boolean isBanned() {
    return banned;
  }

  public void setBanned(boolean banned) {
    this.banned = banned;
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

  public boolean hasPossibleDuplicates() {
    return possibleDuplicates;
  }

  public void setPossibleDuplicates(boolean possibleDuplicates) {
    this.possibleDuplicates = possibleDuplicates;
  }
}
