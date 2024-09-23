/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ExaminationResultValue",
    description = "Result of the examination.",
    example = "DOCTOR_LETTER")
public enum ExaminationResultValueDto {
  OK,
  KNOWN,
  DOCTOR_LETTER,
  UNKNOWN
}
