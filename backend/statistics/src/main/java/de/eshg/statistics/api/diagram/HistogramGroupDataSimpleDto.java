/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "HistogramGroupDataSimple")
public record HistogramGroupDataSimpleDto(
    @NotNull @Valid HistogramBinDto histogramBin, @NotNull int count) {}
