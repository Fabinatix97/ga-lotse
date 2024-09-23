/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "VCardAddress")
public record VCardAddressDto(
    @Schema(
            description =
                "The country of the address from the vCard. Does not have to be a country code.",
            example = "Deutschland")
        @NotNull
        String country,
    @Schema(
            description = "The city in which the address from the vCard is located.",
            example = "Berlin")
        @NotNull
        String city,
    @Schema(description = "The postal code of the address from the vCard.", example = "10115")
        @NotNull
        String postalCode,
    @Schema(
            description =
                "The street name of the address, extracted from the street address component in the structured address property",
            example = "Beispielweg")
        @NotNull
        String street,
    @Schema(
            description =
                "The house number of the address, extracted from the street address component in the structured address property",
            example = "43-45")
        @NotNull
        String houseNumber,
    @Schema(
            description = "A descriptive addition to the address from the vCard.",
            example = "2.OG links")
        @NotNull
        String addressAddition,
    @Schema(description = "The postbox (number) of the address from the vCard.", example = "123")
        @NotNull
        String postBox) {}
