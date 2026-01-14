/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "DataPointGroup")
public record DataPointGroupDto(
    @NotBlank String key,
    @NotNull @Valid List<DataPointDto> dataPoints,
    @Valid TrendLineDto trendLine) {}
