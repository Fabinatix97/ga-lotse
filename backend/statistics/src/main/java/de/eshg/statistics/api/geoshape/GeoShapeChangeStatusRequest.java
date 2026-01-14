/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import jakarta.validation.constraints.NotNull;

public record GeoShapeChangeStatusRequest(@NotNull GeoShapeStatusDto status)
    implements AbstractGeoShapeChangeRequest {
  public static final String SCHEMA_NAME = "GeoShapeChangeStatusRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
