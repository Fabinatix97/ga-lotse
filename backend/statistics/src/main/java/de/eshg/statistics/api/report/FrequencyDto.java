/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Frequency")
public enum FrequencyDto {
  PER_MONTH,
  PER_THREE_MONTHS,
  PER_HALF_YEAR,
  PER_YEAR
}
