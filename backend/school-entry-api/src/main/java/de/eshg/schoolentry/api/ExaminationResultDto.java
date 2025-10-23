/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ExaminationResult")
public record ExaminationResultDto(
    ExaminationResultValueDto examinationResultValue, DoctorLetterValueDto doctorLetterValue) {
  public ExaminationResultDto() {
    this(null, null);
  }
}
