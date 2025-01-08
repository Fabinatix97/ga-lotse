/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import de.eshg.inspection.checklist.api.context.ChecklistSectionContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "CreateNewChecklistDefinitionRequest")
public record CreateNewChecklistDefinitionRequest(
    @NotBlank String name,
    String description,
    Boolean isExpandable,
    Boolean deleted,
    Boolean isCoreChecklist,
    Boolean published,
    @NotNull UUID objectTypeId,
    @NotNull @Valid List<ChecklistSectionContextDto> sections) {

  public CreateNewChecklistDefinitionRequest withObjectTypeId(@NotNull UUID objectTypeId) {
    return new CreateNewChecklistDefinitionRequest(
        name,
        description,
        isExpandable,
        deleted,
        isCoreChecklist,
        published,
        objectTypeId,
        sections);
  }

  public CreateNewChecklistDefinitionRequest withName(@NotBlank String name) {
    return new CreateNewChecklistDefinitionRequest(
        name,
        description,
        isExpandable,
        deleted,
        isCoreChecklist,
        published,
        objectTypeId,
        sections);
  }
}
