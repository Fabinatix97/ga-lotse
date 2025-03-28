/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class ProphylaxisSession extends BaseEntityWithExternalId {

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private Instant dateAndTime;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private UUID institutionId;

  @DataSensitivity(PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProphylaxisType type;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private String groupName;

  @DataSensitivity(PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DentitionType dentitionType;

  @DataSensitivity(PSEUDONYMIZED)
  private boolean isScreening;

  @DataSensitivity(PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private FluoridationVarnish fluoridationVarnish;

  @DataSensitivity(PROTECTED)
  @OneToMany(
      orphanRemoval = true,
      cascade = CascadeType.PERSIST,
      mappedBy = Examination_.PROPHYLAXIS_SESSION)
  @OrderBy
  @BatchSize(size = 100)
  private final List<Examination> examinations = new ArrayList<>();

  @Column(nullable = false)
  @CreatedDate
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant createdAt;

  @Column(nullable = false)
  @LastModifiedDate
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant modifiedAt;

  @ElementCollection
  @Column(name = "dentist_id", nullable = false)
  @OrderColumn(name = "dentist_id_order")
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private List<UUID> dentistIds = new ArrayList<>();

  @ElementCollection
  @Column(name = "zfa_id", nullable = false)
  @OrderColumn(name = "zfa_id_order")
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private List<UUID> zfaIds = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProphylaxisStatus status;

  public Instant getDateAndTime() {
    return dateAndTime;
  }

  public void setDateAndTime(Instant date) {
    this.dateAndTime = date;
  }

  public UUID getInstitutionId() {
    return institutionId;
  }

  public void setInstitutionId(UUID institutionId) {
    this.institutionId = institutionId;
  }

  public ProphylaxisType getType() {
    return type;
  }

  public void setType(ProphylaxisType type) {
    this.type = type;
  }

  public String getGroupName() {
    return groupName;
  }

  public void setGroupName(String groupName) {
    this.groupName = groupName;
  }

  public DentitionType getDentitionType() {
    return dentitionType;
  }

  public void setDentitionType(DentitionType dentitionType) {
    this.dentitionType = dentitionType;
  }

  public boolean isScreening() {
    return isScreening;
  }

  public void setIsScreening(boolean isScreening) {
    this.isScreening = isScreening;
  }

  public boolean hasFluoridationVarnish() {
    return getFluoridationVarnish() != null;
  }

  public FluoridationVarnish getFluoridationVarnish() {
    return fluoridationVarnish;
  }

  public void setFluoridationVarnish(FluoridationVarnish fluoridationVarnish) {
    this.fluoridationVarnish = fluoridationVarnish;
  }

  public List<Examination> getExaminations() {
    return examinations;
  }

  public void addExamination(Examination examination) {
    this.examinations.add(examination);
    examination.setProphylaxisSession(this);
  }

  public void removeExamination(Examination examination) {
    this.examinations.remove(examination);
    examination.setProphylaxisSession(null);
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public List<UUID> getDentistIds() {
    return dentistIds;
  }

  public void setDentistIds(List<UUID> dentists) {
    this.dentistIds = dentists;
  }

  public List<UUID> getZfaIds() {
    return zfaIds;
  }

  public void setZfaIds(List<UUID> zfas) {
    this.zfaIds = zfas;
  }

  public ProphylaxisStatus getProphylaxisStatus() {
    return status;
  }

  public void setProphylaxisStatus(ProphylaxisStatus prophylaxisStatus) {
    this.status = prophylaxisStatus;
  }
}
