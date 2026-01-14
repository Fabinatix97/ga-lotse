/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import static de.eshg.statistics.api.evaluation.AddEvaluationWithTemplateRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddEvaluationWithTemplateRequest(
    @NotBlank String name,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull boolean anonymized,
    @NotNull UUID templateId)
    implements AbstractAddEvaluationRequest {
  public static final String SCHEMA_NAME = "AddEvaluationWithTemplateRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
