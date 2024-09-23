/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "PersonFileState")
public record AddPersonFileStateResponse(
    @Schema(description = "Id of the Person.", example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Size(min = 1, max = 119) String title,
    @NotNull SalutationDto salutation,
    @NotNull GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCodeDto countryOfBirth,
    @NotNull List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    @NotNull List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Schema(
            description =
                "The version of referenceData that was present when the FileState was created. Can be increased if a newer version is irrelevant for the Procedure and the outdated flag shall be suppressed.",
            example = "1")
        @NotNull
        Long referenceVersion,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin)
    implements PersonDetails {}
