/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(name = "InspectionSamplingPoint")
public record InspectionSamplingPointDto(
    @NotNull UUID id,
    @NotNull @Size(min = 1, max = 300) String zid,
    @NotNull @Size(min = 1, max = 300) String name) {}
