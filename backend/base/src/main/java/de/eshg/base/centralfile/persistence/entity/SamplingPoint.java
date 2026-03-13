/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.centralfile.CentralFileData;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Optional;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(
    indexes = {
      @Index(columnList = "reference_facility_id"),
      @Index(columnList = "reference_sampling_point_id"),
      @Index(columnList = "name")
    })
@EntityListeners(AuditingEntityListener.class)
public class SamplingPoint extends SequencedBaseEntityWithExternalId implements CentralFileData {

  @PrePersist
  void initializeReferenceZid() {
    if (this.referenceSamplingPoint != null) {
      this.zid = null;
    }
  }

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant deleteAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Long referenceVersion;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String name;

  @Column(unique = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String zid;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private DataOrigin dataOrigin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reference_sampling_point_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private SamplingPoint referenceSamplingPoint;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reference_facility_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @NotNull
  private Facility referenceFacility;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  @Override
  public Instant getDeleteAt() {
    return deleteAt;
  }

  public void setDeleteAt(Instant deleteAt) {
    this.deleteAt = deleteAt;
  }

  @Override
  public Long getReferenceVersion() {
    return referenceVersion;
  }

  @Override
  public CentralFileData getReferenceData() {
    return getReferenceSamplingPoint();
  }

  public void setReferenceVersion(Long referenceVersion) {
    this.referenceVersion = referenceVersion;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getZid() {
    return Optional.ofNullable(getReferenceSamplingPoint()).map(SamplingPoint::getZid).orElse(zid);
  }

  public void setZid(String zid) {
    this.zid = zid;
  }

  @Override
  public DataOrigin getDataOrigin() {
    return dataOrigin;
  }

  public void setDataOrigin(DataOrigin dataOrigin) {
    this.dataOrigin = dataOrigin;
  }

  public SamplingPoint getReferenceSamplingPoint() {
    return referenceSamplingPoint;
  }

  public void setReferenceSamplingPoint(SamplingPoint referenceSamplingPoint) {
    this.referenceSamplingPoint = referenceSamplingPoint;
  }

  public Facility getReferenceFacility() {
    return referenceFacility;
  }

  public void setReferenceFacility(Facility referenceFacility) {
    this.referenceFacility = referenceFacility;
  }

  public SamplingPoint cloneFromFileState() {
    SamplingPoint clone = new SamplingPoint();
    clone.setReferenceSamplingPoint(null);
    clone.setReferenceFacility(getReferenceFacility());
    clone.setName(getName());
    clone.setZid(getZid());
    clone.setReferenceVersion(null);
    clone.setDataOrigin(getDataOrigin());
    return clone;
  }

  public SamplingPoint cloneFromReferenceSamplingPoint() {
    SamplingPoint clone = new SamplingPoint();
    clone.setReferenceSamplingPoint(this);
    clone.setName(getName());
    clone.setZid(getZid());
    clone.setReferenceVersion(getVersion());
    clone.setDataOrigin(getDataOrigin());

    return clone;
  }

  @JsonIgnore
  public boolean isReferenceData() {
    return referenceSamplingPoint == null;
  }

  @JsonIgnore
  public boolean isFileState() {
    return referenceSamplingPoint != null;
  }

  @JsonIgnore
  public boolean isActive() {
    return deleteAt == null;
  }
}
