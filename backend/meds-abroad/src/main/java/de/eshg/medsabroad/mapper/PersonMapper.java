/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.medsabroad.api.CreatePersonDto;
import de.eshg.medsabroad.api.PersonDto;
import java.util.Objects;

public class PersonMapper {

  private PersonMapper() {}

  public static PersonDto toInterfaceType(GetPersonFileStateResponse person) {
    return new PersonDto(
        person.referenceVersion(),
        person.id(),
        Objects.requireNonNullElse(person.outdated(), false),
        person.title(),
        person.salutation(),
        person.gender(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.countryOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        person.contactAddress(),
        person.differentBillingAddress());
  }

  public static AddPersonFileStateRequest toApiType(CreatePersonDto person) {
    return new AddPersonFileStateRequest(
        person.referenceId(),
        person.title(),
        person.salutation(),
        person.gender(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.countryOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        person.contactAddress(),
        person.differentBillingAddress(),
        DataOriginDto.MANUAL);
  }

  public static UpdatePersonRequest toApiType(de.eshg.medsabroad.api.UpdatePersonRequest person) {
    if (person == null) {
      return null;
    }

    return new UpdatePersonRequest(
        new PersonDetailsDto(
            person.title(),
            person.salutation(),
            person.gender(),
            person.firstName(),
            person.lastName(),
            person.dateOfBirth(),
            person.nameAtBirth(),
            person.placeOfBirth(),
            person.countryOfBirth(),
            person.emailAddresses(),
            person.phoneNumbers(),
            person.contactAddress(),
            person.differentBillingAddress()));
  }
}
