/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ScoredEvaluationExamination")
public record ScoredEvaluationExaminationDto(
    Integer points, @Valid @NotNull EvaluationExaminationDto evaluation)
    implements HasEvaluationExamination {
  public ScoredEvaluationExaminationDto() {
    this(null, new EvaluationExaminationDto());
  }
}
