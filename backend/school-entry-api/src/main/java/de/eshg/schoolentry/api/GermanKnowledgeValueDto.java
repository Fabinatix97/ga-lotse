/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GermanKnowledgeValue")
public enum GermanKnowledgeValueDto {
  NO_GERMAN,
  BAD,
  FLUID_WITH_MAJOR_ERRORS,
  FLUID_WITH_MINOR_ERRORS,
  FAULTLESS,
  UNKNOWN
}
