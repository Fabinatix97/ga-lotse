/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

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

@Schema(description = "Request used for adding persons from external sources")
public record ExternalAddPersonFileStateRequest(
    @Size(min = 1, max = 119) String title,
    SalutationDto salutation,
    GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    CountryCodeDto countryOfBirth,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements PersonDetails {

  public ExternalAddPersonFileStateRequest(PersonDetailsDto personDetailsDto) {
    this(
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
        personDetailsDto.differentBillingAddress());
  }
}
