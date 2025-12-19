/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

public record CreateChildRequest(
    UUID referenceId,
    @Size(min = 1, max = 119) String title,
    SalutationDto salutation,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    GenderDto gender,
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull int year,
    String groupName,
    @NotNull UUID institutionId) {

  public CreateChildRequest(
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      Year year,
      String groupName,
      UUID institutionId) {
    this(firstName, lastName, null, dateOfBirth, year, groupName, institutionId);
  }

  public CreateChildRequest(
      String firstName,
      String lastName,
      GenderDto gender,
      LocalDate dateOfBirth,
      Year year,
      String groupName,
      UUID institutionId) {
    this(
        null,
        null,
        null,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        year.getValue(),
        groupName,
        institutionId);
  }

  public CreateChildRequest(
      String firstName,
      String lastName,
      GenderDto gender,
      LocalDate dateOfBirth,
      AddressDto contactAddress,
      Year year,
      String groupName,
      UUID institutionId) {
    this(
        null,
        null,
        null,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        null,
        null,
        null,
        null,
        null,
        contactAddress,
        null,
        year.getValue(),
        groupName,
        institutionId);
  }
}
