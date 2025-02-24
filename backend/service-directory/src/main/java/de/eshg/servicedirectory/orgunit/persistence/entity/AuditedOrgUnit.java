/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.FederalState;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.staging.persistence.entity.StagedInfo;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

@Entity
@Table(
    uniqueConstraints = {
      @UniqueConstraint(
          name = "UQ_AUDITED_ORG_UNIT_READABLE_NAME_FEDERAL_STATE_TYPE",
          columnNames = {"readable_name", "federal_state", "type"})
    })
@Audited
@DataSensitivity(SensitivityLevel.PUBLIC)
public non-sealed class AuditedOrgUnit extends GloballyUniqueEntityBase implements OrgUnit {

  @Column(nullable = false)
  private String readableName;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  protected OrgUnitType type;

  @Column(nullable = false)
  protected Boolean active;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private FederalState federalState;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "orgUnit", orphanRemoval = true)
  @NotAudited
  @OrderBy
  private final List<AuditedActor> actors = new ArrayList<>();

  @Embedded private final StagedInfo<StagedOrgUnit> stagedInfo = new StagedInfo<>();

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

  public List<AuditedActor> getActors() {
    return actors;
  }

  public void addActor(AuditedActor actor) {
    this.actors.add(actor);
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
