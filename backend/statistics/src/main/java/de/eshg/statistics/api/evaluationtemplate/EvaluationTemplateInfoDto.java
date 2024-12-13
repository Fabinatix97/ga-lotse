/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "EvaluationTemplateInfo")
public record EvaluationTemplateInfoDto(
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull @Valid TemplateSensitivityInfo templateSensitivityInfo,
    @NotNull List<String> dataSourceNames,
    @NotNull @Min(0) int analysisCount,
    @NotNull UUID userId,
    @NotNull Instant createdAt,
    Instant lastUsageAt) {}
