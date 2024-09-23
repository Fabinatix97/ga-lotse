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
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedBy;

@Entity
@Audited
public class ManualProgressEntry extends ProgressEntry implements FileAware, LockableEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ManualProgressEntryType manualProgressEntryType;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String subject;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String messageText;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String note;

  @CreatedBy
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID createdBy;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private KeyDocumentType keyDocumentType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer keyDocumentVersion;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean locked = false;

  public ManualProgressEntryType getManualProgressEntryType() {
    return manualProgressEntryType;
  }

  public void setManualProgressEntryType(ManualProgressEntryType manualProgressEntryType) {
    this.manualProgressEntryType = manualProgressEntryType;
  }

  @Override
  public String getSubject() {
    return subject;
  }

  @Override
  public void setSubject(String subject) {
    this.subject = subject;
  }

  @Override
  public String getMessageText() {
    return messageText;
  }

  @Override
  public void setMessageText(String messageText) {
    this.messageText = messageText;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  @Override
  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  @Override
  public boolean supportsUpload(FileType fileType) {
    return getManualProgressEntryType().supports(fileType);
  }

  public KeyDocumentType getKeyDocumentType() {
    return keyDocumentType;
  }

  public void setKeyDocumentType(KeyDocumentType keyDocumentType) {
    this.keyDocumentType = keyDocumentType;
  }

  public Integer getKeyDocumentVersion() {
    return keyDocumentVersion;
  }

  public void setKeyDocumentVersion(Integer keyDocumentVersion) {
    this.keyDocumentVersion = keyDocumentVersion;
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
