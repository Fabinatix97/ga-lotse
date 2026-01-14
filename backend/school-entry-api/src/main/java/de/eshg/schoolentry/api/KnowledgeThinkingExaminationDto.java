/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "KnowledgeThinkingExamination")
public record KnowledgeThinkingExaminationDto(
    Integer countingPoints,
    Integer quantityKnowledgePoints,
    @Valid @NotNull EvaluationExaminationDto evaluation)
    implements HasEvaluationExamination {
  public KnowledgeThinkingExaminationDto() {
    this(null, null, new EvaluationExaminationDto());
  }
}
