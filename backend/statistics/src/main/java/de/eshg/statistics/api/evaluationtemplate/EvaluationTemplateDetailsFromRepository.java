/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.statistics.api.RepositoryMetaInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record EvaluationTemplateDetailsFromRepository(
    @NotNull @Valid RepositoryMetaInfo repositoryMetaInfo,
    @NotNull @Valid List<DataSourceWithAttributeNames> dataSources,
    @NotNull @Valid List<AnalysisInfo> analysisInfos) {}
