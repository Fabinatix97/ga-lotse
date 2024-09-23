/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
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

@HttpExchange(CitizenAccessCodeUserApi.BASE_URL)
public interface CitizenAccessCodeUserApi {
  String BASE_URL = BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API;

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a citizen access code user")
  CitizenAccessCodeUserDto getCitizenAccessCodeUser(
      @Parameter(
              description = "Id of the citizen user",
              example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
          @PathVariable("id")
          UUID userId);

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Create a new citizen access code user")
  CitizenAccessCodeUserDto addCitizenAccessCodeUser(
      @Valid @RequestBody AddCitizenAccessCodeUserRequest request);

  @DeleteExchange("/{id}/delete")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Delete a citizen access code user")
  void deleteCitizenAccessCodeUser(
      @Parameter(
              description = "Id of the citizen user",
              example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
          @PathVariable("id")
          UUID userId);
}
