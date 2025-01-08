/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.person;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
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
