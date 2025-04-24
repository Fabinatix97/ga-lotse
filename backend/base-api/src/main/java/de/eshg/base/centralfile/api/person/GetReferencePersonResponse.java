/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record GetReferencePersonResponse(
    @Schema(description = "Id of the Person.", example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        @NotNull
        long version,
    @Size(min = 1, max = 119) String title,
    @NotNull SalutationDto salutation,
    @NotNull GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    @NotNull List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @NotNull List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin,
    @NotNull @Size(min = 8, max = 8) String humanReadableId)
    implements PersonDetails {}
