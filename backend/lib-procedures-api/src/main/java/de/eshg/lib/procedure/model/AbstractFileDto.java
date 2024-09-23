/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.*;

@Schema(name = AbstractFileDto.SCHEMA_NAME, allOf = AbstractFileReferenceDto.class)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public abstract sealed class AbstractFileDto extends AbstractFileReferenceDto
    permits GenericFileDto, ConcreteFileDto {

  public static final String SCHEMA_NAME = "AbstractFile";
  private @CanBeLogged @NotNull Instant createdAt;
  private @CanBeLogged @NotNull Instant modifiedAt;
  private @NotNull UUID createdBy;
  private @NotNull String fileName;
  private @CanBeLogged @NotNull FileTypeDto fileType;
  private @CanBeLogged @NotNull int fileSizeBytes;
  private UUID attachedToMail;
  private @CanBeLogged @NotNull boolean locked;

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

  public UUID getAttachedToMail() {
    return attachedToMail;
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

  public void setAttachedToMail(UUID attachedToMail) {
    this.attachedToMail = attachedToMail;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }
}
