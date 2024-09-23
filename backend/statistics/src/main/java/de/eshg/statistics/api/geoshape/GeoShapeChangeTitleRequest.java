/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import jakarta.validation.constraints.NotBlank;

public record GeoShapeChangeTitleRequest(@NotBlank String title)
    implements AbstractGeoShapeChangeRequest {
  public static final String SCHEMA_NAME = "GeoShapeChangeTitleRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
