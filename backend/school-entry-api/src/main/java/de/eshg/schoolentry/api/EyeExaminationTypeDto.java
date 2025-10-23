/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = EyeExaminationTypeDto.SCHEMA_NAME,
    description = "Different conditions to which the child's vision is examined.")
public enum EyeExaminationTypeDto {
  DISTANCE,
  DISTANCE_PLUS_15DPT,
  DISTANCE_WITH_GLASSES;

  public static final String SCHEMA_NAME = "EyeExaminationType";
}
