/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "EvaluationTemplate")
public record EvaluationTemplateDto(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull @Valid List<DataSourceWithAttributeNames> dataSources,
    @NotNull @Valid List<AnalysisInfo> analysisInfos,
    @NotNull Instant createdAt,
    Instant lastUsageAt) {}
