/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PercentageValue", description = "Percentage value of visibility")
public enum PercentageValueDto {
  PERCENTAGE_LT_15,
  PERCENTAGE_15,
  PERCENTAGE_30,
  PERCENTAGE_50,
  PERCENTAGE_70,
  PERCENTAGE_100;
}
