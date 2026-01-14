/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "DoctorLetterValue",
    description =
        "The child's family doctor comments on the findings of the health department regarding the examination. Only relevant if examinationResultValue == DOCTOR_LETTER.",
    example = "CONFIRMED")
public enum DoctorLetterValueDto {
  NO_REPLY,
  CONFIRMED,
  PARTIALLY_CONFIRMED,
  NOT_CONFIRMED
}
