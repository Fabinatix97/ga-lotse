/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.statistics.api.chart.UpdateChartConfigurationDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record UpdateAnalysisRequest(
    @NotBlank String name, @Valid UpdateChartConfigurationDto updateChartConfigurationDto) {}
