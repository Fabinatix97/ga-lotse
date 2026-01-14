/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.api;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Schema(name = "PacklistDefinitionRevision")
public class PacklistDefinitionRevisionDto {
  private @NotNull UUID id;
  private @NotNull UUID defId;
  private @NotNull String name;
  private String description;
  private @NotNull Instant validFrom;
  private Instant validTo;
  private @NotNull int revision;
  private @Valid UserDto modifiedBy;
  private @Valid ObjectTypeRefDto objectType;
  private @Valid @NotNull List<PacklistDefinitionElementDto> elements = new ArrayList<>();

  public @NotNull UUID getId() {
    return id;
  }

  public void setId(@NotNull UUID id) {
    this.id = id;
  }

  public @NotNull UUID getDefId() {
    return defId;
  }

  public void setDefId(@NotNull UUID defId) {
    this.defId = defId;
  }

  public @NotNull String getName() {
    return name;
  }

  public void setName(@NotNull String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public @NotNull Instant getValidFrom() {
    return validFrom;
  }

  public void setValidFrom(@NotNull Instant validFrom) {
    this.validFrom = validFrom;
  }

  public Instant getValidTo() {
    return validTo;
  }

  public void setValidTo(Instant validTo) {
    this.validTo = validTo;
  }

  @NotNull
  public int getRevision() {
    return revision;
  }

  public void setRevision(@NotNull int revision) {
    this.revision = revision;
  }

  public @Valid UserDto getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(@Valid UserDto modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public @Valid ObjectTypeRefDto getObjectType() {
    return objectType;
  }

  public void setObjectType(@Valid ObjectTypeRefDto objectType) {
    this.objectType = objectType;
  }

  public @Valid @NotNull List<PacklistDefinitionElementDto> getElements() {
    return elements;
  }

  public void setElements(@Valid @NotNull List<PacklistDefinitionElementDto> elements) {
    this.elements = elements;
  }
}
