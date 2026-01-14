/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.GetConfigurationResponse;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = PublicConfigApi.BASE_URL)
public interface PublicConfigApi {

  String BASE_URL = Base.PUBLIC_CONFIG_API;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get general system configuration which is needed by the frontend")
  GetConfigurationResponse getConfig();
}
