/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.chart.ChartConfigurationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "Analysis")
public record AnalysisDto(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull int numberOfDiagrams,
    @NotNull Instant createdAt,
    @NotNull @Valid ChartConfigurationDto chartConfiguration) {}
