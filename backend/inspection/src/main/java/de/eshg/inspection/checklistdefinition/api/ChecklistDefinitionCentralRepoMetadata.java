/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "ChecklistDefinitionCentralRepoMetadata")
public record ChecklistDefinitionCentralRepoMetadata(
    @NotNull long centralRepoId,
    @NotNull String name,
    @NotNull int version,
    @NotNull boolean isCoreChecklist,
    @NotNull String objectType,
    String description,
    String changeLog,
    String contact,
    @NotNull String origin,
    @NotNull Instant createdAt,
    UUID cldId,
    Integer localCldRepoVersion,
    @NotNull boolean isExpandable) {}
