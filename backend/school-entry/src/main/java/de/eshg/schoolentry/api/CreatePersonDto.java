/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "CreatePerson")
public record CreatePersonDto(
    UUID referenceId,
    @Size(min = 1, max = 119) String title,
    SalutationDto salutation,
    GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress) {

  public CreatePersonDto(
      GenderDto gender, String firstName, String lastName, LocalDate dateOfBirth) {
    this(gender, firstName, lastName, dateOfBirth, null);
  }

  public CreatePersonDto(
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      AddressDto contactAddress) {
    this(gender, firstName, lastName, dateOfBirth, null, null, null, contactAddress);
  }

  public CreatePersonDto(
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      CountryCode countryOfBirth,
      List<String> phoneNumbers,
      AddressDto contactAddress) {
    this(
        null,
        null,
        null,
        gender,
        firstName,
        lastName,
        dateOfBirth,
        null,
        placeOfBirth,
        countryOfBirth,
        null,
        phoneNumbers,
        contactAddress,
        null);
  }
}
