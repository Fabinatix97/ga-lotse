/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import de.eshg.servicedirectory.staging.persistence.entity.StagedInfo;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;

@Entity
@Table(
    uniqueConstraints = {
      @UniqueConstraint(
          name = "uk_audited_actor_org_unit_id_readable_name",
          columnNames = {"org_unit_id", "readable_name"}),
      @UniqueConstraint(
          name = "uk_audited_actor_common_name",
          columnNames = {"common_name"}),
      @UniqueConstraint(
          name = "uk_audited_actor_metadata_id",
          columnNames = {"actor_metadata_id"})
    })
@Audited
@DataSensitivity(SensitivityLevel.PUBLIC)
public non-sealed class AuditedActor extends GloballyUniqueEntityBase implements Actor {

  @Column(nullable = false)
  private String readableName;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ActorType type;

  @Column(nullable = false)
  private String commonName;

  @Column private String networkId;
  @Column private String certificateValue;
  @Column private String certificateSignature;
  @Column private String certificateSignatory;

  @Column(nullable = false)
  private Boolean active;

  @Column(nullable = false)
  private Boolean manualCertificate;

  @ManyToOne(optional = false)
  @JoinColumn(name = "org_unit_id")
  private AuditedOrgUnit orgUnit;

  @OneToOne(
      cascade = {CascadeType.ALL},
      fetch = FetchType.EAGER,
      orphanRemoval = true)
  private ActorMetadata actorMetadata;

  @Embedded private final StagedInfo<StagedActor> stagedInfo = new StagedInfo<>();

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
  public Certificate getCertificate() {
    if (certificateValue == null) {
      return null;
    }
    return new Certificate(certificateValue, certificateSignature, certificateSignatory);
  }

  @Override
  public void setCertificate(Certificate certificate) {
    if (certificate != null) {
      certificateValue = certificate.value();
      certificateSignature = certificate.signature();
      certificateSignatory = certificate.signatory();
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

  public Boolean isManualCertificate() {
    return manualCertificate;
  }

  public void setManualCertificate(Boolean manualCertificate) {
    this.manualCertificate = manualCertificate;
  }

  public AuditedOrgUnit getOrgUnit() {
    return orgUnit;
  }

  public void setOrgUnit(AuditedOrgUnit orgUnit) {
    this.orgUnit = orgUnit;
  }

  public ActorMetadata getActorMetadata() {
    return actorMetadata;
  }

  public void setActorMetadata(ActorMetadata actorMetadata) {
    this.actorMetadata = actorMetadata;
  }
}
