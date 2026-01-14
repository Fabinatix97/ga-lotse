/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.diagram;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "HistogramGroupDataCategorized")
public record HistogramGroupDataCategorizedDto(
    @NotNull @Valid HistogramBinDto histogramBin,
    @NotNull @Valid List<KeyToCountDto> keyToCounts) {}
