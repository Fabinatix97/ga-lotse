/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GeoShapeStatus")
public enum GeoShapeStatusDto {
  ACTIVE,
  ARCHIVED
}
