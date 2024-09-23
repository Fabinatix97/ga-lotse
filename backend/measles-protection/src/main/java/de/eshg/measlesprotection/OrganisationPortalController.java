/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.measlesprotection.api.citizenportal.ReportCaseRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = OrganisationPortalController.BASE_URL)
@Tag(name = "OrganisationPortal")
public class OrganisationPortalController {
  public static final String BASE_URL = BaseUrls.MeaslesProtection.ORGANISATION_CONTROLLER;

  private final OrganisationPortalService publicMeaslesProtectionService;

  public OrganisationPortalController(OrganisationPortalService publicMeaslesProtectionService) {
    this.publicMeaslesProtectionService = publicMeaslesProtectionService;
  }

  @PostMapping("/report")
  @Operation(
      summary =
          "A method to report multiple affected persons belonging to a facility and open draft cases")
  public void report(@RequestBody @Valid ReportCaseRequest request) {
    publicMeaslesProtectionService.reportCases(request);
  }
}
