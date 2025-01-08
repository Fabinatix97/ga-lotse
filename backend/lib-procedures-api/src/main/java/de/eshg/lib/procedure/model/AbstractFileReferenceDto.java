/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = AbstractFileReferenceDto.SCHEMA_NAME)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public abstract sealed class AbstractFileReferenceDto
    permits AbstractFileDto, GenericFileReferenceDto {

  public static final String SCHEMA_NAME = "AbstractFileReference";

  @NotNull private UUID fileId;
  @NotNull private boolean deleted;
  @NotNull private boolean deletable;

  public void setFileId(UUID fileId) {
    this.fileId = fileId;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public void setDeletable(boolean deletable) {
    this.deletable = deletable;
  }

  public UUID getFileId() {
    return this.fileId;
  }

  public boolean isDeleted() {
    return this.deleted;
  }

  public boolean isDeletable() {
    return this.deletable;
  }
}
