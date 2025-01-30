/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;
import java.util.UUID;

@Schema(name = GenericFileReferenceDto.SCHEMA_NAME)
@JsonTypeName(GenericFileReferenceDto.SCHEMA_NAME)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public final class GenericFileReferenceDto extends AbstractFileReferenceDto {

  public static final String SCHEMA_NAME = "GenericFileReference";

  public GenericFileReferenceDto(UUID fileId, boolean deleted, boolean deletable) {
    setFileId(fileId);
    setDeleted(deleted);
    setDeletable(deletable);
  }

  @Override
  public Set<UUID> getResolvableUserIds() {
    return Set.of();
  }
}
