/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.citizenuser.api.GetCitizenPermissionsResponse;
import de.eshg.base.citizenuser.api.GetCitizenSelfUserResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(CitizenUserApi.BASE_URL)
public interface CitizenUserApi {
  String BASE_URL = BaseUrls.Base.CITIZEN_USER_API;
  String SELF_PERMISSIONS_URL = "/self/permissions";

  @GetExchange(SELF_PERMISSIONS_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the permissions of the user which is currently active")
  GetCitizenPermissionsResponse getCitizenSelfUserPermissions();

  @GetExchange(BaseUrls.Base.CITIZEN_USER_SELF_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the name of the citizen user which is currently active")
  GetCitizenSelfUserResponse getCitizenSelfUser();
}
