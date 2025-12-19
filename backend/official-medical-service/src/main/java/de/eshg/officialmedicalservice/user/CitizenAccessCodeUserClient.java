/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.user;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class CitizenAccessCodeUserClient {
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public CitizenAccessCodeUserClient(CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public CitizenAccessCodeUserDto addCitizenAccessCodeUser(UUID personFileStateId) {
    AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest request =
        new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(personFileStateId);
    return doAndForwardErrorCodes(
        () -> citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(request));
  }

  public CitizenAccessCodeUserDto getCitizenAccessCode(UUID citizenUserId) {
    return doAndForwardErrorCodes(
        () -> citizenAccessCodeUserApi.getCitizenAccessCodeUser(citizenUserId));
  }

  public void deleteCitizenAccessCodeUser(UUID citizenUserId) {
    doAndForwardErrorCodes(
        () -> {
          citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(citizenUserId);
          return null;
        });
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
