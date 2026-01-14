/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
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
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCode countryOfBirth,
    List<@MandatoryEmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin)
    implements PersonDetails {

  public AddPersonFileStateRequest(
      String firstName, String lastName, LocalDate dateOfBirth, DataOriginDto dataOrigin) {
    this(new PersonDetailsDto(firstName, lastName, dateOfBirth), dataOrigin);
  }

  public AddPersonFileStateRequest(PersonDetails personDetails, DataOriginDto dataOrigin) {
    this(
        null,
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
        personDetails.differentBillingAddress(),
        dataOrigin);
  }

  public AddPersonFileStateRequest(
      UUID referencePersonId, PersonDetails personDetails, DataOriginDto dataOrigin) {
    this(
        referencePersonId,
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
        personDetails.differentBillingAddress(),
        dataOrigin);
  }
}
