/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.chart.AddChartConfigurationDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddAnalysisRequest(
    @NotNull UUID evaluationId,
    @NotBlank String name,
    @NotNull @Valid AddChartConfigurationDto chartConfiguration) {}
