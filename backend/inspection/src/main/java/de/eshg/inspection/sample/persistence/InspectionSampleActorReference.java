/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InspectionSampleActorReference extends BaseEntity {
  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  InspectionSampleActorReferenceType type;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  UUID referencedId;

  public @NotNull InspectionSampleActorReferenceType getType() {
    return type;
  }

  public void setType(@NotNull InspectionSampleActorReferenceType type) {
    this.type = type;
  }

  public UUID getReferencedId() {
    return referencedId;
  }

  public void setReferencedId(UUID referencedId) {
    this.referencedId = referencedId;
  }
}
