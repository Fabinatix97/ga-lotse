/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "FacilityContactPerson")
public record FacilityContactPersonDto(
    @Schema(
            description = "The email addresses of the Contact Person.",
            example = "mail1@address.de")
        @Size(min = 6, max = 254)
        String emailAddress,
    @Schema(description = "The phone number of the Contact Person.", example = "+491234567890")
        @Size(min = 1, max = 23)
        String phoneNumber,
    @Schema(description = "The role of the Contact Person in the Facility.", example = "CEO")
        @Size(min = 1, max = 255)
        String role,
    @Schema(description = "The last name of the Contact Person.", example = "Doe")
        @NotNull
        @Size(min = 1, max = 120)
        String lastName,
    @Schema(description = "The given name(s) of the Contact Person.", example = "John")
        @Size(min = 1, max = 80)
        String firstName,
    @Schema(description = "The academic title of the Contact Person.", example = "Prof. Dr.")
        @Size(min = 1, max = 119)
        String title,
    SalutationDto salutation,
    GenderDto gender) {}
