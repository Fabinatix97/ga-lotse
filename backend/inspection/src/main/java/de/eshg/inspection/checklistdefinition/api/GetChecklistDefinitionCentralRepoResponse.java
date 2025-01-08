/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record GetChecklistDefinitionCentralRepoResponse(
    @Valid @NotNull ChecklistDefinitionDto checklistDefinition,
    String description,
    String changeLog,
    String contact,
    @NotNull String origin,
    @NotNull Instant createdAt,
    Integer localCldRepoVersion) {}
