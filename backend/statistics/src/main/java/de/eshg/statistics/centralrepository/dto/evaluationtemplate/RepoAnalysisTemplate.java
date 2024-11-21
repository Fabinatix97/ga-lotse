/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.evaluationtemplate;

import de.eshg.statistics.centralrepository.dto.chartconfiguration.RepoChartConfiguration;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RepoAnalysisTemplate(
    @NotBlank String name,
    @NotNull RepoChartConfiguration chartConfiguration,
    @NotNull List<RepoDiagramTemplate> diagrams) {}
