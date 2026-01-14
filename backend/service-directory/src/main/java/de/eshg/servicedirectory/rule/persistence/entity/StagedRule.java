/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import de.eshg.servicedirectory.staging.persistence.entity.StagingInfo;
import jakarta.persistence.*;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(
    uniqueConstraints = {
      @UniqueConstraint(
          name = "UQ_STAGED_RULE_AUDITED_ENTITY_ID",
          columnNames = {"audited_entity_id"}),
      @UniqueConstraint(
          name = "UQ_COLUMNS_STAGED_RULE",
          columnNames = {
            "client_federal_state",
            "client_org_unit_type",
            "client_org_unit_name",
            "client_actor_type",
            "client_actor_name",
            "server_federal_state",
            "server_org_unit_type",
            "server_org_unit_name",
            "server_actor_type",
            "server_actor_name"
          })
    })
public non-sealed class StagedRule extends GloballyUniqueEntityBase
    implements StagedEntity<AuditedRule>, Rule {

  @PostLoad
  public void init() {
    if (client == null) {
      client = ActorSelector.empty();
    }
    if (server == null) {
      server = ActorSelector.empty();
    }
  }

  @Embedded private final StagingInfo<AuditedRule> stagingInfo = new StagingInfo<>();

  @Column private String description;

  @Embedded
  @AttributeOverride(name = "federalState", column = @Column(name = "client_federal_state"))
  @AttributeOverride(name = "orgUnitType", column = @Column(name = "client_org_unit_type"))
  @AttributeOverride(name = "orgUnitName", column = @Column(name = "client_org_unit_name"))
  @AttributeOverride(name = "actorType", column = @Column(name = "client_actor_type"))
  @AttributeOverride(name = "actorName", column = @Column(name = "client_actor_name"))
  ActorSelector client;

  @Embedded
  @AttributeOverride(name = "federalState", column = @Column(name = "server_federal_state"))
  @AttributeOverride(name = "orgUnitType", column = @Column(name = "server_org_unit_type"))
  @AttributeOverride(name = "orgUnitName", column = @Column(name = "server_org_unit_name"))
  @AttributeOverride(name = "actorType", column = @Column(name = "server_actor_type"))
  @AttributeOverride(name = "actorName", column = @Column(name = "server_actor_name"))
  ActorSelector server;

  @Column private Boolean active;

  @Override
  public StagingInfo<AuditedRule> getStagingInfo() {
    return stagingInfo;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public ActorSelector getClient() {
    return client;
  }

  @Override
  public void setClient(ActorSelector client) {
    this.client = client;
  }

  @Override
  public ActorSelector getServer() {
    return server;
  }

  @Override
  public void setServer(ActorSelector server) {
    this.server = server;
  }

  @Override
  public Boolean isActive() {
    return active;
  }

  @Override
  public void setActive(Boolean active) {
    this.active = active;
  }
}
