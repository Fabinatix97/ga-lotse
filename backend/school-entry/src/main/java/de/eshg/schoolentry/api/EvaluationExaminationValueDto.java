/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
