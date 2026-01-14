/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public record GetFileNumberCollisionsResponse(
    @Valid @NotNull
        Map<Integer, @NotNull List<@Valid FileNumberCollisionInspectionDto>> collisions) {}
