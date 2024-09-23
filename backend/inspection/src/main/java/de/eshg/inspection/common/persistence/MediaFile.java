/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PROTECTED)
@Table(indexes = @Index(columnList = "file_content_id"))
public class MediaFile extends BaseEntity {

  @Column(nullable = false, unique = true)
  private UUID fileExternalId = UUID.randomUUID();

  @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "file_content_id")
  private MediaFileContent fileContent;

  @CreatedBy
  @Column(nullable = false)
  private UUID createdBy;

  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private String fileName;

  private long fileSize;

  @Column(nullable = false)
  private boolean deleted;

  private String mediaType;

  public UUID getFileExternalId() {
    return fileExternalId;
  }

  public void setFileExternalId(UUID externalId) {
    this.fileExternalId = externalId;
  }

  public MediaFileContent getFileContent() {
    return fileContent;
  }

  public void setFileContent(MediaFileContent fileContent) {
    this.fileContent = fileContent;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String filename) {
    this.fileName = filename;
  }

  public long getFileSize() {
    return fileSize;
  }

  public void setFileSize(long filesize) {
    this.fileSize = filesize;
  }

  public boolean isDeleted() {
    return deleted;
  }

  public boolean isNotDeleted() {
    return !deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public String getMediaType() {
    return mediaType;
  }

  public void setMediaType(String filetype) {
    this.mediaType = filetype;
  }

  public MediaFile getCopy() {
    MediaFile copy = new MediaFile();
    copy.setMediaType(mediaType);
    copy.setFileName(fileName);
    copy.setFileSize(fileSize);
    copy.setDeleted(deleted);
    copy.setFileContent(fileContent);
    return copy;
  }
}
