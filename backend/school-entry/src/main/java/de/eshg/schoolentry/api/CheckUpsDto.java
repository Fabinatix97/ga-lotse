/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CheckUps")
public record CheckUpsDto(
    @Schema(description = "Boolean that indicates, if the U2 screening was carried out") Boolean u2,
    @Schema(description = "Boolean that indicates, if the U3 screening was carried out") Boolean u3,
    @Schema(description = "Boolean that indicates, if the U4 screening was carried out") Boolean u4,
    @Schema(description = "Boolean that indicates, if the U5 screening was carried out") Boolean u5,
    @Schema(description = "Boolean that indicates, if the U6 screening was carried out") Boolean u6,
    @Schema(description = "Boolean that indicates, if the U7 screening was carried out") Boolean u7,
    @Schema(description = "Boolean that indicates, if the U7A screening was carried out")
        Boolean u7a,
    @Schema(description = "Boolean that indicates, if the U8 screening was carried out") Boolean u8,
    @Schema(description = "Boolean that indicates, if the U9 screening was carried out")
        Boolean u9) {
  public CheckUpsDto() {
    this(null, null, null, null, null, null, null, null, null);
  }
}
