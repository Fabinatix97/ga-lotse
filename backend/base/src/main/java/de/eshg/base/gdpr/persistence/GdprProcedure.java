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
import java.util.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class GdprProcedure extends BaseEntityWithExternalId {
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID centralFileId;

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

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String internalNote;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = GdprDownload_.GDPR_PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<GdprDownload> downloads = new ArrayList<>();

  public UUID getCentralFileId() {
    return centralFileId;
  }

  public void setCentralFileId(UUID centralFileId) {
    this.centralFileId = centralFileId;
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

  public String getInternalNote() {
    return internalNote;
  }

  public void setInternalNote(String internalNote) {
    this.internalNote = internalNote;
  }

  public Collection<GdprDownload> getDownloads() {
    return downloads;
  }

  public void addDownload(GdprDownload download) {
    downloads.add(download);
    download.setGdprProcedure(this);
  }

  public void deleteDownload(UUID downloadIdToDelete) {
    Iterator<GdprDownload> iterator = downloads.iterator();
    while (iterator.hasNext()) {
      GdprDownload download = iterator.next();
      if (download.getDownloadId().equals(downloadIdToDelete)) {
        download.setGdprProcedure(null);
        iterator.remove();
        break;
      }
    }
  }
}
