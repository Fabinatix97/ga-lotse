/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.model.HasResolvableUserIds;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Schema(name = "ProgressEntry")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public abstract sealed class ProgressEntryDto implements HasResolvableUserIds
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

  @Override
  public Set<UUID> getResolvableUserIds() {
    return Optional.ofNullable(fileReference)
        .map(HasResolvableUserIds::getResolvableUserIds)
        .orElseGet(Collections::emptySet);
  }
}
