/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.foureyes.domain.model.LockableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.annotation.CreatedBy;

@Entity
@Audited
public non-sealed class ManualProgressEntry extends ProgressEntry
    implements LockableEntity, KeyDocumentAware {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ManualProgressEntryType manualProgressEntryType;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String note;

  @CreatedBy
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID createdBy;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String keyDocumentType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer keyDocumentVersion;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean locked = false;

  @NotAudited
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(orphanRemoval = true, fetch = FetchType.LAZY)
  private ManualProgressEntryDeletionApprovalRequest deletionApprovalRequest;

  public ManualProgressEntryType getManualProgressEntryType() {
    return manualProgressEntryType;
  }

  public void setManualProgressEntryType(ManualProgressEntryType manualProgressEntryType) {
    this.manualProgressEntryType = manualProgressEntryType;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  @Override
  public boolean supportsUpload(ProcedureFileType fileType) {
    return getManualProgressEntryType().supports(fileType);
  }

  @Override
  public String getKeyDocumentType() {
    return keyDocumentType;
  }

  @Override
  public void setKeyDocumentType(String keyDocumentType) {
    this.keyDocumentType = keyDocumentType;
  }

  @Override
  public Integer getKeyDocumentVersion() {
    return keyDocumentVersion;
  }

  @Override
  public void setKeyDocumentVersion(Integer keyDocumentVersion) {
    this.keyDocumentVersion = keyDocumentVersion;
  }

  public void setDeletionApprovalRequest(
      ManualProgressEntryDeletionApprovalRequest deletionApprovalRequest) {
    this.deletionApprovalRequest = deletionApprovalRequest;
  }

  public boolean isLocked() {
    return locked;
  }

  @Override
  public void lock(boolean locked) {
    this.locked = locked;
    File file = this.getFile();
    if (file != null) {
      file.lockByProgressEntry(locked);
    }
  }
}
