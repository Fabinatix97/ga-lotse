/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import static de.eshg.infectionbriefing.mapper.SalutationMapper.mapToInfectionBriefingSalutationDto;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.ApplicantAddressDto;
import de.eshg.infectionbriefing.api.PersonDetailsDto;
import de.eshg.rest.service.error.InternalServerErrorException;

public class PersonDetailsMapper {
  private PersonDetailsMapper() {}

  public static PersonDetailsDto mapToPersonDetailsDto(GetPersonFileStateResponse person) {
    return new PersonDetailsDto(
        mapToInfectionBriefingSalutationDto(person.salutation()),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        mapToApplicantAddressDto(person.contactAddress()));
  }

  private static ApplicantAddressDto mapToApplicantAddressDto(AddressDto address) {
    return switch (address) {
      case null -> null;
      case DomesticAddressDto domesticAddressDto ->
          new ApplicantAddressDto(
              domesticAddressDto.street(),
              domesticAddressDto.houseNumber(),
              domesticAddressDto.postalCode(),
              domesticAddressDto.city());
      case PostboxAddressDto _ ->
          throw new InternalServerErrorException("Postbox address is not supported here");
    };
  }
}
