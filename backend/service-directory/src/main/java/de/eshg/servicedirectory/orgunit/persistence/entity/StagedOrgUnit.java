/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.FederalState;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import de.eshg.servicedirectory.staging.persistence.entity.StagingInfo;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(
    uniqueConstraints = {
      @UniqueConstraint(
          name = "UQ_STAGED_ORG_UNIT_AUDITED_ENTITY_ID",
          columnNames = {"audited_entity_id"})
    })
public non-sealed class StagedOrgUnit extends GloballyUniqueEntityBase
    implements StagedEntity<AuditedOrgUnit>, OrgUnit {

  @Embedded private final StagingInfo<AuditedOrgUnit> stagingInfo = new StagingInfo<>();

  @Column private String readableName;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  private OrgUnitType type;

  @Column private Boolean active;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  private FederalState federalState;

  @Override
  public StagingInfo<AuditedOrgUnit> getStagingInfo() {
    return stagingInfo;
  }

  @Override
  public String getReadableName() {
    return readableName;
  }

  @Override
  public void setReadableName(String readableName) {
    this.readableName = readableName;
  }

  @Override
  public OrgUnitType getType() {
    return type;
  }

  @Override
  public void setType(OrgUnitType type) {
    this.type = type;
  }

  @Override
  public Boolean isActive() {
    return active;
  }

  @Override
  public void setActive(Boolean active) {
    this.active = active;
  }

  @Override
  public FederalState getFederalState() {
    return federalState;
  }

  @Override
  public void setFederalState(FederalState federalState) {
    this.federalState = federalState;
  }
}
