/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.person;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonSyncDto;

public class PersonMapper {

  private PersonMapper() {}

  public static AffectedPersonDto mapToAffectedPersonDto(
      GetPersonFileStateResponse personFileState, long version) {
    if (personFileState == null) {
      return null;
    }
    return new AffectedPersonDto(
        version,
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
        personFileState.contactAddress(),
        new AffectedPersonSyncDto(
            personFileState.id(), personFileState.referenceVersion(), personFileState.outdated()));
  }

  public static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      AffectedPersonDto affectedPersonDto) {
    if (affectedPersonDto == null) {
      return null;
    }
    return new AddPersonFileStateRequest(
        mapToPersonDetailsDto(affectedPersonDto), DataOriginDto.MANUAL);
  }

  public static ExternalAddPersonFileStateRequest mapToExternalAddPersonFileStateRequest(
      AffectedPersonDto affectedPersonDto) {
    if (affectedPersonDto == null) {
      return null;
    }
    return new ExternalAddPersonFileStateRequest(mapToPersonDetailsDto(affectedPersonDto));
  }

  public static UpdatePersonRequest mapToUpdatePersonRequest(AffectedPersonDto affectedPersonDto) {
    if (affectedPersonDto == null) {
      return null;
    }
    return new UpdatePersonRequest(mapToPersonDetailsDto(affectedPersonDto));
  }

  public static PersonDetailsDto mapToPersonDetailsDto(AffectedPersonDto affectedPersonDto) {
    return new PersonDetailsDto(
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
        null);
  }
}
