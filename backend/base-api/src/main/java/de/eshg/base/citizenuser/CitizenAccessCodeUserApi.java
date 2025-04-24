/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithPinCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.api.UpdateCredentialRequest;
import de.eshg.base.citizenuser.api.VerifyCitizenAccessCodeUserCredentialsRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(CitizenAccessCodeUserApi.BASE_URL)
public interface CitizenAccessCodeUserApi {
  String BASE_URL = BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API;

  @PostExchange("/date-of-birth")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Create a new citizen access code user with a date of birth credential")
  CitizenAccessCodeUserDto addCitizenAccessCodeUserWithDateOfBirthCredential(
      @Valid @RequestBody AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest request);

  @PostExchange("/pin")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Create a new citizen access code user with a pin credential")
  CitizenAccessCodeUserDto addCitizenAccessCodeUserWithPinCredential(
      @Valid @RequestBody AddCitizenAccessCodeUserWithPinCredentialRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a citizen access code user")
  CitizenAccessCodeUserDto getCitizenAccessCodeUser(
      @Parameter(
              description = "Id of the citizen user",
              example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
          @PathVariable("id")
          UUID userId);

  @DeleteExchange("/{id}/delete")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Delete a citizen access code user")
  void deleteCitizenAccessCodeUser(
      @Parameter(
              description = "Id of the citizen user",
              example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
          @PathVariable("id")
          UUID userId);

  @PostExchange("/{id}/verify")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Verify citizen access code user credentials")
  void verifyCitizenAccessCodeUserCredentials(
      @Parameter(
              description = "Id of the citizen user",
              example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
          @PathVariable("id")
          UUID userId,
      @Valid @RequestBody VerifyCitizenAccessCodeUserCredentialsRequest request);

  @PutExchange("/credential")
  @ApiResponse(responseCode = "204")
  @Operation(summary = "Updates the credential in the context of a citizen user")
  void updateCredential(@Valid @RequestBody UpdateCredentialRequest request);
}
