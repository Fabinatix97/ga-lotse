/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "ExpectedEvaluationTemplate")
public record ExpectedEvaluationTemplateDto(
    @NotNull @Valid List<DataSourceWithAttributeNames> dataSources,
    @NotNull @Valid List<AnalysisInfo> analysisInfos) {}
