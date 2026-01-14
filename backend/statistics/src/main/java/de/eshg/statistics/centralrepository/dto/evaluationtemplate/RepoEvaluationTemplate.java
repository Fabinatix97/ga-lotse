/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.evaluationtemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record RepoEvaluationTemplate(
    @NotNull UUID id,
    @NotBlank String name,
    String description,
    @NotNull @Valid List<RepoDataSource> dataSources,
    @NotNull @Valid List<RepoAnalysisTemplate> analyses) {}
