/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GetDepartmentInfoResponse(
    @Schema(
            description = "The name of the department",
            example = "Gesundheitsamt Landkreis Testgebiet")
        @NotBlank
        String name,
    @Schema(description = "The abbreviation of the name of the department", example = "LTG")
        String abbreviation,
    @Schema(
            description =
                "The street name for the department’s address, not including the house number",
            example = "Beispielweg")
        @NotBlank
        String street,
    @Schema(
            description =
                "The house number at the department's address, including any extensions or suffixes",
            example = "1b")
        @NotBlank
        String houseNumber,
    @Schema(description = "The postal code for the department’s address", example = "12345")
        @NotBlank
        String postalCode,
    @Schema(
            description = "The name of the city where the department is located",
            example = "Berlin")
        @NotBlank
        String city,
    @Schema(
            description = "The ISO country code of the country where the department is located.",
            example = "DE")
        @NotNull
        CountryCode country,
    @Schema(
            description = "The primary contact telephone number for the department",
            example = "+491234567890")
        @NotBlank
        String phoneNumber,
    @Schema(
            description = "The domain of the department's official homepage, excluding protocols",
            example = "department-homepage.de")
        @NotBlank
        String homepage,
    @Schema(description = "The email address of the department", example = "mail@address.de")
        @NotBlank
        String email,
    @NotNull @Valid LocationDto location) {}
