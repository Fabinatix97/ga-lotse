/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_INFO;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_LOGO;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_SECURITY_TXT;

import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = DepartmentApi.BASE_URL)
public interface DepartmentApi {
  String BASE_URL = BaseUrls.Base.DEPARTMENT_API;

  @GetExchange(DEPARTMENT_API_INFO)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get detailed information about the department running this application.")
  GetDepartmentInfoResponse getDepartmentInfo();

  @GetExchange(DEPARTMENT_API_LOGO)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the logo of the department running this application.")
  ResponseEntity<Resource> getDepartmentLogo();

  @GetExchange(DEPARTMENT_API_SECURITY_TXT)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the security.txt file of the department running this application.")
  ResponseEntity<byte[]> getSecurityTxt();
}
