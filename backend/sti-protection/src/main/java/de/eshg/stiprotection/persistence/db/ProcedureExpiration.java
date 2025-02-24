/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.Assert;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(
    indexes = {
      @Index(name = "idx_procedure_expiration_created_at", columnList = "created_at"),
      @Index(name = "idx_procedure_expiration_external_id", columnList = "procedure_external_id")
    })
@EntityListeners(AuditingEntityListener.class)
public class ProcedureExpiration extends BaseEntity {

  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  private UUID procedureExternalId;

  public ProcedureExpiration() {}

  public ProcedureExpiration(StiProtectionProcedure procedure) {
    Assert.notNull(procedure, "StiProtectionProcedure must not be null");
    procedureExternalId = procedure.getExternalId();
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public UUID getProcedureExternalId() {
    return procedureExternalId;
  }

  public void setProcedureExternalId(UUID procedureExternalId) {
    this.procedureExternalId = procedureExternalId;
  }
}
