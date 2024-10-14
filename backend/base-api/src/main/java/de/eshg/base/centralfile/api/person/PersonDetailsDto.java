/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.CustomValidations.EmailAddressConstraint;
import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Schema(name = PersonDetailsDto.SCHEMA_NAME, description = "The personal data relating to a person")
public record PersonDetailsDto(
    @Size(min = 1, max = 119) String title,
    SalutationDto salutation,
    GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCodeDto countryOfBirth,
    List<@EmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements PersonDetails {

  public static final String SCHEMA_NAME = "PersonDetails";

  public PersonDetailsDto(String firstName, String lastName, LocalDate dateOfBirth) {
    this(null, firstName, lastName, dateOfBirth);
  }

  public PersonDetailsDto(
      GenderDto gender, String firstName, String lastName, LocalDate dateOfBirth) {
    this(gender, firstName, lastName, dateOfBirth, null, null);
  }

  public PersonDetailsDto(
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      AddressDto contactAddress,
      List<String> phoneNumbers) {
    this(
        null,
        null,
        gender,
        firstName,
        lastName,
        dateOfBirth,
        null,
        null,
        null,
        null,
        phoneNumbers,
        contactAddress,
        null);
  }

  public PersonDetailsDto(
      String title,
      SalutationDto salutation,
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      AddressDto contactAddress) {
    this(
        title,
        salutation,
        gender,
        firstName,
        lastName,
        dateOfBirth,
        null,
        null,
        null,
        null,
        null,
        contactAddress,
        null);
  }

  public PersonDetailsDto(PersonDetails personDetails) {
    this(
        personDetails.title(),
        personDetails.salutation(),
        personDetails.gender(),
        personDetails.firstName(),
        personDetails.lastName(),
        personDetails.dateOfBirth(),
        personDetails.nameAtBirth(),
        personDetails.placeOfBirth(),
        personDetails.countryOfBirth(),
        personDetails.emailAddresses(),
        personDetails.phoneNumbers(),
        personDetails.contactAddress(),
        personDetails.differentBillingAddress());
  }
}
