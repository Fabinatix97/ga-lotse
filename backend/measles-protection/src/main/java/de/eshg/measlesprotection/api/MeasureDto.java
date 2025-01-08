/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Measure")
public enum MeasureDto {
  ACCESS_RESTRICTION,
  MONETARY_FINE
}
