/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
