/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
