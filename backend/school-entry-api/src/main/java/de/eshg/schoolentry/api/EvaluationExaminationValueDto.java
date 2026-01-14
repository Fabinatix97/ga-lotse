/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = EvaluationExaminationValueDto.SCHEMA_NAME)
public enum EvaluationExaminationValueDto {
  CONSPICUOUS,
  BORDERLINE,
  INCONSPICUOUS,
  UNKNOWN;

  public static final String SCHEMA_NAME = "EvaluationExaminationValue";
}
