/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(value = LsdOrgUnitApi.BASE_URL)
public interface LsdOrgUnitApi {
  String BASE_URL = "/orgUnit";
  String NAME_URL = "/name";
  String ACTORS_URL = "/actors";

  @Operation(summary = "Get the name of the orgUnit")
  @GetExchange(value = NAME_URL)
  @ApiResponse(responseCode = "200", description = "Returns the name of the orgUnit")
  String getName();

  @Operation(summary = "Get all actors of the orgUnit")
  @GetExchange(value = ACTORS_URL)
  @ApiResponse(responseCode = "200", description = "Returns all actors associated with the orgUnit")
  GetActorsResponse getActors();
}
