/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.concern;

import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureController;
import de.eshg.officialmedicalservice.procedure.api.GetConcernsResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = EmployeeOmsProcedureController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Concern")
public class ConcernController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String CONCERNS_URL = "/concerns";

  private final ConcernService concernService;

  public ConcernController(ConcernService concernService) {
    this.concernService = concernService;
  }

  @GetMapping(path = CONCERNS_URL)
  @Operation(summary = "Get all available concerns")
  public GetConcernsResponse getAllConcerns() {
    return concernService.getConcerns();
  }
}
