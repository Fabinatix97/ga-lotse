/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ChecklistDefinitionFromCentralRepoUpdateRequest")
public record ChecklistDefinitionFromCentralRepoUpdateRequest(
    @NotNull long centralRepoId,
    @NotNull int centralRepoVersion,
    @NotNull boolean isCoreChecklist) {}
