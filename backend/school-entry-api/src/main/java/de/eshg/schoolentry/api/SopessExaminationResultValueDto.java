/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SopessExaminationResultValue")
public enum SopessExaminationResultValueDto {
  OK,
  KNOWN,
  DOCTOR_LETTER,
  BORDERLINE,
  UNKNOWN
}
