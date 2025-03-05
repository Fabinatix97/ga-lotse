/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenauth;

import de.eshg.officialmedicalservice.citizenauth.api.GetCitizenProcedureDetailsResponse;
import de.eshg.officialmedicalservice.procedure.CitizenOmsProcedureService;
import de.eshg.rest.service.security.config.BaseUrls.OfficialMedicalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = CitizenAuthController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenAuth")
public class CitizenAuthController {
  public static final String BASE_URL = OfficialMedicalService.CITIZEN_AUTH_API;
  public static final String PROCEDURE_URL = "/procedure";

  private final CitizenOmsProcedureService citizenOmsProcedureService;

  public CitizenAuthController(CitizenOmsProcedureService citizenOmsProcedureService) {
    this.citizenOmsProcedureService = citizenOmsProcedureService;
  }

  @GetMapping(path = PROCEDURE_URL)
  @Operation(summary = "Get procedure details")
  public GetCitizenProcedureDetailsResponse getProcedureDetails(
      @AuthenticationPrincipal Jwt principal) {
    return citizenOmsProcedureService.getProcedureDetails(getCitizenUserId(principal));
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }
}
