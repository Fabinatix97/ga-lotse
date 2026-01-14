/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "PersonDetails")
public record PersonDetailsDto(
    @NotNull long version,
    @NotNull String humanReadableId,
    @NotNull UUID fileStateId,
    @NotNull boolean fileStateOutdated,
    @Size(min = 1, max = 119) String title,
    @NotNull SchoolEntrySalutationDto salutation,
    @NotNull SchoolEntryGenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    @NotNull List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    @NotNull List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid SchoolEntryAddressDto contactAddress,
    @Valid SchoolEntryAddressDto differentBillingAddress)
    implements PersonBaseDto {}
