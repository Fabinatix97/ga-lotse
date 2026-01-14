/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "District")
public record DistrictDto(
    @Schema(description = "The number of the district", example = "0601") @NotNull
        String districtCode,
    @Schema(description = "The name of the district", example = "Berlin-Steglitz") @NotNull
        String districtName,
    @Schema(
            description = "The Community Identification Number (Amtlicher Gemeindeschlüssel)",
            example = "11000000")
        @NotNull
        String municipalityKey) {}
