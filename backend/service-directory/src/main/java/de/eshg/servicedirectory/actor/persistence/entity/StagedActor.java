/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.servicedirectory.staging.persistence.entity.StagedEntity;
import de.eshg.servicedirectory.staging.persistence.entity.StagingInfo;
import jakarta.persistence.*;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(
    uniqueConstraints = {
      @UniqueConstraint(
          name = "UQ_STAGED_ACTOR_AUDITED_ENTITY_ID",
          columnNames = {"audited_entity_id"})
    })
public non-sealed class StagedActor extends GloballyUniqueEntityBase
    implements StagedEntity<AuditedActor>, Actor {

  @Embedded private final StagingInfo<AuditedActor> stagingInfo = new StagingInfo<>();

  @Column private String readableName;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ActorType type;

  @Column private String commonName;

  @Column private String networkId;
  @Column private String currentCertificateValue;
  @Column private String currentCertificateSignature;
  @Column private String currentCertificateSignatory;
  @Column private String previousCertificateValue;
  @Column private String previousCertificateSignature;
  @Column private String previousCertificateSignatory;

  @Column private Boolean active;
  @Column private Boolean manualCertificate;

  @Column private UUID orgUnitId;

  public StagingInfo<AuditedActor> getStagingInfo() {
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
  public ActorType getType() {
    return type;
  }

  @Override
  public void setType(ActorType type) {
    this.type = type;
  }

  @Override
  public String getCommonName() {
    return commonName;
  }

  @Override
  public void setCommonName(String commonName) {
    this.commonName = commonName;
  }

  @Override
  public Certificate getCurrentCertificate() {
    if (currentCertificateValue == null) {
      return null;
    }
    return new Certificate(
        currentCertificateValue, currentCertificateSignature, currentCertificateSignatory);
  }

  @Override
  public void setCurrentCertificate(Certificate currentCertificate) {
    if (currentCertificate != null) {
      currentCertificateValue = currentCertificate.value();
      currentCertificateSignature = currentCertificate.signature();
      currentCertificateSignatory = currentCertificate.signatory();
    }
  }

  @Override
  public Certificate getPreviousCertificate() {
    if (previousCertificateValue == null) {
      return null;
    }
    return new Certificate(
        previousCertificateValue, previousCertificateSignature, previousCertificateSignatory);
  }

  @Override
  public void setPreviousCertificate(Certificate previousCertificate) {
    if (previousCertificate != null) {
      previousCertificateValue = previousCertificate.value();
      previousCertificateSignature = previousCertificate.signature();
      previousCertificateSignatory = previousCertificate.signatory();
    } else {
      previousCertificateValue = null;
      previousCertificateSignature = null;
      previousCertificateSignatory = null;
    }
  }

  @Override
  public String getNetworkId() {
    return networkId;
  }

  @Override
  public void setNetworkId(String networkId) {
    this.networkId = networkId;
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
  public Boolean isManualCertificate() {
    return manualCertificate;
  }

  @Override
  public void setManualCertificate(Boolean manualCertificate) {
    this.manualCertificate = manualCertificate;
  }

  public UUID getOrgUnitId() {
    return orgUnitId;
  }

  public void setOrgUnitId(UUID orgUnitId) {
    this.orgUnitId = orgUnitId;
  }
}
