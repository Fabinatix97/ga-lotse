/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.Configuration;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = ConfigApi.BASE_URL)
public interface ConfigApi {

  String BASE_URL = Base.CONFIG_API;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get general system configuration which is needed by the frontend")
  Configuration getConfig();
}
