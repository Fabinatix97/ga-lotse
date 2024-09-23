/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
