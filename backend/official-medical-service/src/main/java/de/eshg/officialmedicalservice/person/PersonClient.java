/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.person;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonDiffResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.UUID;
import java.util.function.Supplier;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class PersonClient {
  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public AddPersonFileStateResponse addPersonFileState(AddPersonFileStateRequest request) {
    return doAndForwardErrorCodes(() -> personApi.addPersonFileState(request));
  }

  public GetPersonFileStateResponse getPersonFileState(UUID id) {
    return doAndForwardErrorCodes(() -> personApi.getPersonFileState(id));
  }

  public GetPersonFileStatesResponse getPersonFileStates(GetPersonFileStatesRequest request) {
    return doAndForwardErrorCodes(() -> personApi.getPersonFileStates(request));
  }

  public AddPersonFileStateResponse updatePersonFileStateAndReference(
      UUID id, UpdatePersonRequest request) {
    return doAndForwardErrorCodes(() -> personApi.updatePersonFileStateAndReference(id, request));
  }

  public UUID syncAffectedPerson(UUID fileStateId, long referenceVersion) {
    return doAndForwardErrorCodes(
        () ->
            personApi.syncFileState(fileStateId, new SyncFileStateRequest(referenceVersion)).id());
  }

  public GetPersonDiffResponse getAffectedPersonDiff(UUID fileStateId) {
    return doAndForwardErrorCodes(() -> personApi.getPersonDiff(fileStateId));
  }

  public UUID createPersonFromExternalSource(AffectedPersonDto person) {
    ExternalAddPersonFileStateRequest request =
        new ExternalAddPersonFileStateRequest(
            StringUtils.trimToNull(person.title()),
            person.salutation(),
            person.gender(),
            person.firstName().trim(),
            person.lastName().trim(),
            person.dateOfBirth(),
            StringUtils.trimToNull(person.nameAtBirth()),
            StringUtils.trimToNull(person.placeOfBirth()),
            person.countryOfBirth(),
            person.emailAddresses(),
            person.phoneNumbers(),
            person.contactAddress(),
            null);
    AddPersonFileStateResponse personFromExternalSource =
        personApi.addPersonFromExternalSource(request);
    return personFromExternalSource.id();
  }

  private <T> T doAndForwardErrorCodes(Supplier<T> action) {
    try {
      return action.get();
    } catch (HttpClientErrorException e) {
      if (e.getStatusCode().isSameCodeAs(HttpStatus.UNAUTHORIZED)) {
        throw new BadRequestException(ErrorCode.UNAUTHORIZED, "Unauthorized base module call");
      }
      ErrorResponse errorResponse = e.getResponseBodyAs(ErrorResponse.class);
      if (errorResponse != null) {
        throw new BadRequestException(errorResponse.errorCode(), errorResponse.message());
      } else {
        throw new BadRequestException(
            ErrorCode.UNEXPECTED_ERROR, "Could not read error from base module");
      }
    }
  }
}
