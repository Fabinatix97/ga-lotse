/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import static de.eshg.statistics.api.evaluation.UpdateEvaluationTimeRangeRequest.SCHEMA_NAME;

import de.eshg.statistics.api.TimeRange;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = SCHEMA_NAME)
public record UpdateEvaluationTimeRangeRequest(@NotNull @Valid TimeRange timeRange)
    implements AbstractUpdateEvaluationRequest {
  public static final String SCHEMA_NAME = "UpdateEvaluationTimeRangeRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
