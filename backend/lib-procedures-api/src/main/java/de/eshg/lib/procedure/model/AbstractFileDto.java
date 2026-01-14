/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.model.AbstractFileDto.SCHEMA_NAME;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import de.cronn.commons.lang.SetUtils;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
@JsonTypeInfo(use = Id.NAME, property = "@type")
public abstract sealed class AbstractFileDto extends AbstractFileReferenceDto
    implements ApprovalRequestEntityDto permits ImageDto, MailDto, PdfDto {

  public static final String SCHEMA_NAME = "AbstractFile";

  private @NotNull Instant createdAt;
  private @NotNull Instant modifiedAt;
  private UUID createdBy;
  private @NotNull String fileName;
  private @NotNull FileTypeDto fileType;
  private @NotNull int fileSizeBytes;
  private @NotNull boolean locked;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public String getFileName() {
    return fileName;
  }

  public FileTypeDto getFileType() {
    return fileType;
  }

  public int getFileSizeBytes() {
    return fileSizeBytes;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public void setFileType(FileTypeDto fileType) {
    this.fileType = fileType;
  }

  public void setFileSizeBytes(int fileSizeBytes) {
    this.fileSizeBytes = fileSizeBytes;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  @Override
  @JsonIgnore
  public Set<UUID> getResolvableUserIds() {
    UUID createdBy = getCreatedBy();
    if (createdBy == null) {
      return Set.of();
    }

    return SetUtils.orderedSet(createdBy);
  }
}
