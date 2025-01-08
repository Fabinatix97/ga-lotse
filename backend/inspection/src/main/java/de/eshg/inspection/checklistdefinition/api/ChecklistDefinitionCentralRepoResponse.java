/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "ChecklistDefinitionCentralRepoResponse")
public record ChecklistDefinitionCentralRepoResponse(
    @NotNull long centralRepositoryId,
    @NotNull int centralRepositoryVersion,
    @NotNull UUID localCldId,
    @NotNull int localCldVersion) {}
