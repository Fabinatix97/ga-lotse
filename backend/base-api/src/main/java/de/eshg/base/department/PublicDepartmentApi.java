/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_INFO;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_LOGO;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_PRIVACY_NOTICE;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_PRIVACY_POLICY;

import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = PublicDepartmentApi.BASE_URL)
public interface PublicDepartmentApi {
  String BASE_URL = BaseUrls.Base.PUBLIC_DEPARTMENT_API;

  @GetExchange(DEPARTMENT_API_INFO)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get detailed information about the department running this application.")
  GetDepartmentInfoResponse getDepartmentInfo();

  @GetExchange(DEPARTMENT_API_PRIVACY_NOTICE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the privacy-notice document.")
  ResponseEntity<Resource> getPrivacyNotice();

  @GetExchange(DEPARTMENT_API_PRIVACY_POLICY)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the privacy-policy document.")
  ResponseEntity<Resource> getPrivacyPolicy();

  @GetExchange(DEPARTMENT_API_LOGO)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the logo of the department running this application.")
  ResponseEntity<Resource> getDepartmentLogo();
}
