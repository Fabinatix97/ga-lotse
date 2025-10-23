/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
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
    SchoolEntrySalutationDto salutation,
    SchoolEntryGenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid SchoolEntryAddressDto contactAddress,
    @Valid SchoolEntryAddressDto differentBillingAddress) {

  public CreatePersonDto(
      SchoolEntryGenderDto gender, String firstName, String lastName, LocalDate dateOfBirth) {
    this(gender, firstName, lastName, dateOfBirth, null);
  }

  public CreatePersonDto(
      SchoolEntryGenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      SchoolEntryAddressDto contactAddress) {
    this(gender, firstName, lastName, dateOfBirth, null, null, null, contactAddress);
  }

  public CreatePersonDto(
      SchoolEntryGenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      CountryCode countryOfBirth,
      List<String> phoneNumbers,
      SchoolEntryAddressDto contactAddress) {
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

  public CreatePersonDto(
      SchoolEntryGenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      CountryCode countryOfBirth,
      List<String> phoneNumbers,
      List<String> emailAddresses,
      SchoolEntryAddressDto contactAddress) {
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
        emailAddresses,
        phoneNumbers,
        contactAddress,
        null);
  }
}
