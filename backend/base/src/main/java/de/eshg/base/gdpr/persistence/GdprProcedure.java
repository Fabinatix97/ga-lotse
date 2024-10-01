/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
public class GdprProcedure extends BaseEntityWithExternalId {
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID centralFileId;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprProcedureResult result;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprProcedureStatus status;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprProcedureType type;

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

  @OneToOne(cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private IdentificationData identificationData;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String matterOfConcern;

  public UUID getCentralFileId() {
    return centralFileId;
  }

  public void setCentralFileId(UUID centralFileId) {
    this.centralFileId = centralFileId;
  }

  public GdprProcedureResult getResult() {
    return result;
  }

  public void setResult(GdprProcedureResult result) {
    this.result = result;
  }

  public GdprProcedureStatus getStatus() {
    return status;
  }

  public void setStatus(GdprProcedureStatus status) {
    this.status = status;
  }

  public GdprProcedureType getType() {
    return type;
  }

  public void setType(GdprProcedureType type) {
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

  public IdentificationData getIdentificationData() {
    return identificationData;
  }

  public void setIdentificationData(IdentificationData identificationData) {
    this.identificationData = identificationData;
  }

  public String getMatterOfConcern() {
    return matterOfConcern;
  }

  public void setMatterOfConcern(String matterOfConcern) {
    this.matterOfConcern = matterOfConcern;
  }
}
