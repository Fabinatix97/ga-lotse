/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import static de.eshg.statistics.api.evaluation.UpdateEvaluationNameRequest.SCHEMA_NAME;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = SCHEMA_NAME)
public record UpdateEvaluationNameRequest(@NotBlank String name)
    implements AbstractUpdateEvaluationRequest {
  public static final String SCHEMA_NAME = "UpdateEvaluationNameRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
