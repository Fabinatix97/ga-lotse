/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Location", description = "Location defined by latitude and longitude.")
public record LocationDto(
    @Schema(
            description =
                "Geographic coordinate that specifies the north–south angular location of a point on the surface of the Earth.",
            example = "52.516270")
        @NotNull
        Double latitude,
    @Schema(
            description =
                "Geographic coordinate that specifies the east–west angular position of a point on the surface of the Earth.",
            example = "13.377703")
        @NotNull
        Double longitude) {
  public static final String SCHEMA_NAME = "Location";
}
