/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspectionCLDVersion")
public record InspectionCLDVersionDto(
    @NotNull UUID versionId,
    @NotNull UUID definitionId,
    @NotNull String name,
    String description,
    @NotNull int version,
    @NotNull boolean isCoreChecklist,
    @NotNull boolean isExpandable) {}
