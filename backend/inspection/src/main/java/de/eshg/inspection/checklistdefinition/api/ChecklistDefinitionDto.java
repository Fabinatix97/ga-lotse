/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Schema(name = "ChecklistDefinition")
public record ChecklistDefinitionDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull boolean coreChecklist,
    @NotNull boolean expandable, // depends on coreChecklist
    Integer mostRecentRepositoryVersion,
    Integer mostRecentVersionBasedOnRepo,
    @Valid ObjectTypeRefDto objectType,
    @NotNull boolean deleted,
    @NotNull boolean published,
    @NotNull Instant lastModified,
    @Valid @NotNull ChecklistDefinitionVersionDto mostRecentVersion,
    @Valid @NotNull List<ChecklistDefinitionVersionDto> versions) {
  public ChecklistDefinitionDto withoutVersions() {
    return new ChecklistDefinitionDto(
        id,
        name,
        coreChecklist,
        expandable,
        null,
        null,
        objectType,
        deleted,
        published,
        lastModified,
        null,
        new ArrayList<>());
  }
}
