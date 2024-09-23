/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.base.resource.api.ResourceTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InspectionResource")
public record InspectionResourceDto(
    @NotNull UUID baseResourceId,
    @NotNull String name,
    @NotNull ResourceTypeDto type,
    @NotNull Instant start,
    @NotNull Instant end) {}
