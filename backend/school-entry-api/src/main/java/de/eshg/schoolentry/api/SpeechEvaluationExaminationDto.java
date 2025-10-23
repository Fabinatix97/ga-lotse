/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SpeechEvaluationExamination")
public record SpeechEvaluationExaminationDto(
    Integer prepositionPoints,
    Integer pluralPoints,
    @Valid @NotNull EvaluationExaminationDto evaluation)
    implements HasEvaluationExamination {
  public SpeechEvaluationExaminationDto() {
    this(null, null, new EvaluationExaminationDto());
  }
}
