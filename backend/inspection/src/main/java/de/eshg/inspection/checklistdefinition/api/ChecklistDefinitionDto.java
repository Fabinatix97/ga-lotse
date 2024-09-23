/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Schema(name = "ChecklistDefinition")
public record ChecklistDefinitionDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull boolean coreChecklist,
    @NotNull UUID mostRecentVersionId,
    @NotNull int mostRecentVersionNr,
    Integer mostRecentRepositoryVersion,
    Integer mostRecentVersionBasedOnRepo,
    @Valid ObjectTypeRefDto objectType,
    @NotNull boolean deleted,
    @Valid @NotNull List<ChecklistDefinitionVersionDto> versions) {
  public ChecklistDefinitionDto withoutVersion() {
    return new ChecklistDefinitionDto(
        id,
        name,
        coreChecklist,
        mostRecentVersionId,
        mostRecentVersionNr,
        null,
        null,
        objectType,
        deleted,
        new ArrayList<>());
  }
}
