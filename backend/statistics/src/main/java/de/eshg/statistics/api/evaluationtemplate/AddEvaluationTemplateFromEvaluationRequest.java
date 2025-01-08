/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import static de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateFromEvaluationRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = SCHEMA_NAME)
public record AddEvaluationTemplateFromEvaluationRequest(
    @NotBlank String name, String description, @NotNull UUID evaluationId)
    implements AbstractAddEvaluationTemplateRequest {
  public static final String SCHEMA_NAME = "AddEvaluationTemplateFromEvaluationRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
