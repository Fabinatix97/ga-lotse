/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record UpdatePersonRequest(
    @NotNull long version,
    @Size(min = 1, max = 119) String title,
    SalutationDto salutation,
    GenderDto gender,
    @NotNull
        @Size(min = 1, max = 80)
        @Schema(description = "First name of the applicant.", example = "Susanne")
        String firstName,
    @NotNull
        @Size(min = 1, max = 120)
        @Schema(description = "Last name of the applicant.", example = "Gerber")
        String lastName,
    @NotNull
        @DateOfBirth
        @Schema(description = "Date of birth of the applicant.", example = "2018-07-26")
        @Past
        LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress) {

  public UpdatePersonRequest(
      long version, String firstName, String lastName, LocalDate dateOfBirth) {
    this(
        version,
        null,
        null,
        null,
        firstName,
        lastName,
        dateOfBirth,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }
}
