/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.chart;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Grouping")
public enum GroupingDto {
  GROUPED,
  STACKED
}
