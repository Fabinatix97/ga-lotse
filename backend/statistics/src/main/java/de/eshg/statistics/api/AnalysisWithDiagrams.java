/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.chart.ChartConfigurationDto;
import de.eshg.statistics.api.diagram.DiagramDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "AnalysisWithDiagrams")
public record AnalysisWithDiagrams(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull Instant createdAt,
    @NotNull @Valid ChartConfigurationDto chartConfiguration,
    @NotNull @Valid List<DiagramDto> diagrams) {}
