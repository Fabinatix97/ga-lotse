/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "VCardInstitutionContact")
public record VCardInstitutionContactDto(
    @Schema(
            description =
                "The full name of the contact. This field is taken from the unsorted 'FN'-field in the vCard.",
            example = "Maier GmbH")
        @NotNull
        String fullName,
    @NotNull List<String> phoneNumbers,
    @NotNull List<String> emailAddresses,
    @NotNull @Valid List<VCardAddressDto> addresses)
    implements VCardContactDto {}
