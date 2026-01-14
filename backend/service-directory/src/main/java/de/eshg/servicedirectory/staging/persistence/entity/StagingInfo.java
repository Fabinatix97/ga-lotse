/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.staging.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SensitivityLevel.PUBLIC)
public class StagingInfo<T extends GloballyUniqueEntityBase> implements StagedEntity<T> {
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private StagedEntityType stagedEntityType;

  @ManyToOne
  @JoinColumn(name = "audited_entity_id")
  private T auditedEntity;

  @Column(nullable = false)
  private String createdBy;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private StagingStatus stagingStatus = StagingStatus.WORK_IN_PROGRESS;

  @Override
  public UUID getId() {
    return auditedEntity.getId();
  }

  @Override
  public StagingInfo<T> getStagingInfo() {
    return this;
  }

  @Override
  public StagedEntityType getStagedEntityType() {
    return stagedEntityType;
  }

  @Override
  public void setStagedEntityType(StagedEntityType stagedEntityType) {
    this.stagedEntityType = stagedEntityType;
  }

  @Override
  public T getAuditedEntity() {
    return auditedEntity;
  }

  @Override
  public void setAuditedEntity(T auditedEntity) {
    this.auditedEntity = auditedEntity;
  }

  @Override
  public String getCreatedBy() {
    return createdBy;
  }

  @Override
  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  @Override
  public StagingStatus getStagingStatus() {
    return stagingStatus;
  }

  @Override
  public void setStagingStatus(StagingStatus stagingStatus) {
    this.stagingStatus = stagingStatus;
  }
}
