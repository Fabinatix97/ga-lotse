/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import de.eshg.inspection.checklist.api.context.ChecklistSectionContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ChecklistDefinitionVersionRequest")
public record ChecklistDefinitionVersionRequest(
    @NotBlank String name,
    String description,
    Boolean isExpandable,
    Boolean deleted,
    Boolean published,
    @NotNull @Valid List<ChecklistSectionContextDto> sections) {}
