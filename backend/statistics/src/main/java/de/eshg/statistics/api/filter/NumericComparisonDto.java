/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "NumericComparison")
public enum NumericComparisonDto {
  EQUAL,
  GREATER_EQUAL,
  GREATER_THAN,
  LESS_EQUAL,
  LESS_THAN
}
