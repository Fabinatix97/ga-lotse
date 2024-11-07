/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
public class GdprValidationTask extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false, unique = true)
  private UUID procedureId;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprValidationTaskStatus status;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprValidationTaskType type;

  @Column(nullable = false)
  @CreatedDate
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant createdAt;

  @Column(nullable = false)
  @LastModifiedDate
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant modifiedAt;

  @Column
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant closedAt;

  public UUID getProcedureId() {
    return procedureId;
  }

  public void setProcedureId(UUID procedureId) {
    this.procedureId = procedureId;
  }

  public GdprValidationTaskStatus getStatus() {
    return status;
  }

  public void setStatus(GdprValidationTaskStatus status) {
    this.status = status;
  }

  public GdprValidationTaskType getType() {
    return type;
  }

  public void setType(GdprValidationTaskType type) {
    this.type = type;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public Instant getClosedAt() {
    return closedAt;
  }

  public void setClosedAt(Instant closedAt) {
    this.closedAt = closedAt;
  }
}
