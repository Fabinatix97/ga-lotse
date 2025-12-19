/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.person;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonDiffResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.SearchReferencePersonsResponse;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.time.LocalDate;
import java.util.UUID;
import java.util.function.Supplier;
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

  public AddPersonFileStateResponse addPersonFromExternalSource(
      ExternalAddPersonFileStateRequest request) {
    return doAndForwardErrorCodes(() -> personApi.addPersonFromExternalSource(request));
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

  public AddPersonFileStateResponse updateReferencePerson(
      UUID id, UpdateReferencePersonRequest request) {
    return doAndForwardErrorCodes(() -> personApi.updateReferencePerson(id, request));
  }

  public SearchReferencePersonsResponse searchReferencePersons(
      String firstName, String lastName, LocalDate dateOfBirth) {
    return doAndForwardErrorCodes(
        () -> personApi.searchReferencePersons(firstName, lastName, dateOfBirth));
  }

  public UUID syncAffectedPerson(UUID fileStateId, long referenceVersion) {
    return doAndForwardErrorCodes(
        () ->
            personApi.syncFileState(fileStateId, new SyncFileStateRequest(referenceVersion)).id());
  }

  public GetPersonDiffResponse getAffectedPersonDiff(UUID fileStateId) {
    return doAndForwardErrorCodes(() -> personApi.getPersonDiff(fileStateId));
  }

  public void markPersonFileStateForDeletion(UUID... fileStateIds) {
    doAndForwardErrorCodes(
        () -> {
          personApi.markPersonFileStateForDeletion(new DeleteFileStatesRequest(fileStateIds));
          return null;
        });
  }

  public GetReferencePersonResponse getReferencePerson(UUID id) {
    return doAndForwardErrorCodes(() -> personApi.getReferencePerson(id));
  }

  public GetFileStateIdsResponse getPersonFileStateIdsAssociatedWithReferencePerson(UUID id) {
    return doAndForwardErrorCodes(
        () -> personApi.getPersonFileStateIdsAssociatedWithReferencePerson(id));
  }

  public GetReferencePersonResponse getReferencePersonById(UUID id) {
    return getReferencePerson(
        getPersonFileStateIdsAssociatedWithReferencePerson(id).fileStateIds().stream()
            .findAny()
            .orElseThrow());
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
