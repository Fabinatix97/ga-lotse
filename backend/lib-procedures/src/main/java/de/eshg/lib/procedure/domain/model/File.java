/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static jakarta.persistence.CascadeType.PERSIST;
import static jakarta.persistence.InheritanceType.JOINED;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.foureyes.domain.model.LockableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Inheritance(strategy = JOINED)
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "attached_to_mail_id"))
public abstract class File extends BaseEntityWithExternalId implements LockableEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  private UUID createdBy;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = PERSIST, orphanRemoval = true)
  private FileContent fileContent;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String fileName;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProcedureFileType fileType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int fileSizeBytes;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ManyToOne
  @JoinColumn(name = "attached_to_mail_id")
  private Mail attachedToMail;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean deleted;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean deletable = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean lockedBySelf = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean lockedByProgressEntry = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean lockedByMail = false;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(orphanRemoval = true, fetch = FetchType.LAZY)
  private FileDeletionApprovalRequest deletionApprovalRequest;

  public abstract MetaData getMetaData();

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public FileContent getFileContent() {
    return fileContent;
  }

  public void setFileContent(FileContent fileContent) {
    this.fileContent = fileContent;
  }

  void setAttachedToMail(Mail attachedToMail) {
    this.attachedToMail = attachedToMail;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public ProcedureFileType getFileType() {
    return fileType;
  }

  public void setFileType(ProcedureFileType fileType) {
    this.fileType = fileType;
  }

  public int getFileSizeBytes() {
    return fileSizeBytes;
  }

  public void setFileSizeBytes(int fileSizeBytes) {
    this.fileSizeBytes = fileSizeBytes;
  }

  public Mail getAttachedToMail() {
    return attachedToMail;
  }

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public void updateDeletable(boolean deletable) {
    this.deletable = deletable;
  }

  public void setDeletionApprovalRequest(FileDeletionApprovalRequest deletionApprovalRequest) {
    this.deletionApprovalRequest = deletionApprovalRequest;
  }

  @Override
  public void lock(boolean locked) {
    this.lockedBySelf = locked;
  }

  public boolean isLocked() {
    return lockedBySelf || lockedByProgressEntry || lockedByMail;
  }

  public void lockByProgressEntry(boolean lockedByProgressEntry) {
    this.lockedByProgressEntry = lockedByProgressEntry;
  }

  public void lockByMail(boolean lockedByMail) {
    this.lockedByMail = lockedByMail;
  }

  public abstract File copy();

  protected File copyWithMail() {
    Mail mailCopy = attachedToMail.copy();
    int index = attachedToMail.getAttachments().indexOf(this);
    return mailCopy.getAttachments().get(index);
  }

  protected void copy(File destination) {
    destination.fileContent = fileContent.copy();
    destination.fileName = fileName;
    destination.fileType = fileType;
    destination.fileSizeBytes = fileSizeBytes;
    if (attachedToMail != null) {
      destination.attachedToMail = attachedToMail.copy();
      destination.attachedToMail.addAttachment(destination);
    }
    destination.deleted = deleted;
  }
}
