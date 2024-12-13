/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.base.user.api.UserDto;
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
    String description,
    @NotNull @Valid TemplateSensitivityInfo templateSensitivityInfo,
    @NotNull @Valid List<DataSourceWithAttributeNames> dataSources,
    @NotNull @Valid List<AnalysisInfo> analysisInfos,
    @Valid UserDto user,
    @NotNull Instant createdAt,
    Instant lastUsageAt) {}
