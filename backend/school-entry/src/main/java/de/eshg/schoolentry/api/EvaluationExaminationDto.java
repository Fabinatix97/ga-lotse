/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EvaluationExamination")
public record EvaluationExaminationDto(
    SopessExaminationResultValueDto examinationResultValue,
    DoctorLetterValueDto doctorLetterValue) {
  public EvaluationExaminationDto() {
    this(null, null);
  }
}
