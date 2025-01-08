/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "ProgressEntry")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public abstract sealed class ProgressEntryDto
    permits ManualProgressEntryDto, ProcessedInboxProgressEntryDto, SystemProgressEntryDto {
  @NotNull private UUID progressEntryId;
  @NotNull private Instant createdAt;
  @NotNull private Instant modifiedAt;
  private @Valid AbstractFileReferenceDto fileReference;

  public UUID getProgressEntryId() {
    return progressEntryId;
  }

  public void setProgressEntryId(UUID progressEntryId) {
    this.progressEntryId = progressEntryId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public AbstractFileReferenceDto getFileReference() {
    return fileReference;
  }

  public void setFileReference(AbstractFileReferenceDto fileReference) {
    this.fileReference = fileReference;
  }

  @JsonIgnore
  public abstract UUID getRelatedUserId();

  @JsonIgnore
  public abstract void setRelatedUserFirstName(String relatedUserFirstName);

  @JsonIgnore
  public abstract void setRelatedUserLastName(String relatedUserLastName);
}
