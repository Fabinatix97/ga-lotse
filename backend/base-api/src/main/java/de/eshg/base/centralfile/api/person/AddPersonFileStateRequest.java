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
import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(description = "Request used for adding persons from non-external sources")
public record AddPersonFileStateRequest(
    @Schema(
            description =
                "Id of a referencePerson. If this Id is provided, a new File State with the input attributes is created for that referencePerson, regardless of any matching logic.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID referencePersonId,
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
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin)
    implements PersonDetails {

  public AddPersonFileStateRequest(
      String firstName, String lastName, LocalDate dateOfBirth, DataOriginDto dataOrigin) {
    this(new PersonDetailsDto(firstName, lastName, dateOfBirth), dataOrigin);
  }

  public AddPersonFileStateRequest(PersonDetailsDto personDetailsDto, DataOriginDto dataOrigin) {
    this(
        null,
        personDetailsDto.title(),
        personDetailsDto.salutation(),
        personDetailsDto.gender(),
        personDetailsDto.firstName(),
        personDetailsDto.lastName(),
        personDetailsDto.dateOfBirth(),
        personDetailsDto.nameAtBirth(),
        personDetailsDto.placeOfBirth(),
        personDetailsDto.countryOfBirth(),
        personDetailsDto.emailAddresses(),
        personDetailsDto.phoneNumbers(),
        personDetailsDto.contactAddress(),
        personDetailsDto.differentBillingAddress(),
        dataOrigin);
  }

  public AddPersonFileStateRequest(
      UUID referencePersonId, PersonDetailsDto personDetailsDto, DataOriginDto dataOrigin) {
    this(
        referencePersonId,
        personDetailsDto.title(),
        personDetailsDto.salutation(),
        personDetailsDto.gender(),
        personDetailsDto.firstName(),
        personDetailsDto.lastName(),
        personDetailsDto.dateOfBirth(),
        personDetailsDto.nameAtBirth(),
        personDetailsDto.placeOfBirth(),
        personDetailsDto.countryOfBirth(),
        personDetailsDto.emailAddresses(),
        personDetailsDto.phoneNumbers(),
        personDetailsDto.contactAddress(),
        personDetailsDto.differentBillingAddress(),
        dataOrigin);
  }
}
