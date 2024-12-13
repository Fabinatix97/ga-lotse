/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.person;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;

public class PersonMapper {

  private PersonMapper() {}

  public static AffectedPersonDto mapToAffectedPersonDto(
      GetPersonFileStateResponse personFileState) {
    if (personFileState == null) {
      return null;
    }
    return new AffectedPersonDto(
        personFileState.salutation(),
        personFileState.firstName(),
        personFileState.lastName(),
        personFileState.dateOfBirth(),
        personFileState.emailAddresses(),
        personFileState.phoneNumbers(),
        personFileState.countryOfBirth(),
        personFileState.nameAtBirth(),
        personFileState.placeOfBirth(),
        personFileState.title(),
        personFileState.gender(),
        personFileState.contactAddress());
  }

  public static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      AffectedPersonDto affectedPersonDto) {
    if (affectedPersonDto == null) {
      return null;
    }
    return new AddPersonFileStateRequest(
        new PersonDetailsDto(
            affectedPersonDto.title(),
            affectedPersonDto.salutation(),
            affectedPersonDto.gender(),
            affectedPersonDto.firstName(),
            affectedPersonDto.lastName(),
            affectedPersonDto.dateOfBirth(),
            affectedPersonDto.nameAtBirth(),
            affectedPersonDto.placeOfBirth(),
            affectedPersonDto.countryOfBirth(),
            affectedPersonDto.emailAddresses(),
            affectedPersonDto.phoneNumbers(),
            affectedPersonDto.contactAddress(),
            null),
        DataOriginDto.MANUAL);
  }
}
