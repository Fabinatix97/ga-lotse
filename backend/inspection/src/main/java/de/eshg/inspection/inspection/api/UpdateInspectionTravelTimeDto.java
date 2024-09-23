/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;

@Schema(name = "UpdateInspectionTravelTime")
public record UpdateInspectionTravelTimeDto(
    @PositiveOrZero Integer startBufferInMinutes,
    Instant startTime,
    @PositiveOrZero Integer endBufferInMinutes,
    Instant endTime) {}
