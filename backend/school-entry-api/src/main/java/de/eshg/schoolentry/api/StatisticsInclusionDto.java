/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolEntryStatisticsInclusion")
public enum StatisticsInclusionDto {
  INCLUDE,
  CUSTOM,
  EXCLUDE
}
