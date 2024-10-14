/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "StatisticState")
public enum StatisticStateDto {
  COMPLETED,
  FAILED,
  CREATING,
  UPDATING,
  COPY_ONGOING
}
