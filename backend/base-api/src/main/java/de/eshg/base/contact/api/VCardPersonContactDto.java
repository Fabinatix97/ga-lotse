/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "VCardPersonContact")
public record VCardPersonContactDto(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of (academic) titles of the contact in the vCard.",
                    example = "['Prof.','Dr.']"))
        @NotNull
        List<String> titles,
    @NotNull GenderDto gender,
    @Schema(
            description =
                "The full name of the contact including titles, salutations, name prefixes, etc. This field is taken from the unsorted 'FN'-field in the vCard.",
            example = "Mr. John Doe")
        @NotNull
        String fullName,
    @Schema(
            description =
                "The first name(s) of the contact. This field is filled from the sorted 'N'-field of the vCard, if present.",
            example = "John")
        @NotNull
        String firstName,
    @Schema(
            description =
                "The last name(s) of the contact. This field is filled from the sorted 'N'-field of the vCard, if present.",
            example = "Doe")
        @NotNull
        String lastName,
    @NotNull List<String> phoneNumbers,
    @NotNull List<String> emailAddresses,
    @NotNull @Valid List<VCardAddressDto> addresses)
    implements VCardContactDto {}
