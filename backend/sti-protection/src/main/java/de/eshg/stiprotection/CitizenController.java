/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.citizen.GetCitizenProcedureResponse;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = CitizenController.BASE_URL)
@Tag(name = "Citizen")
public class CitizenController {
  public static final String BASE_URL = BaseUrls.StiProtection.CITIZEN_CONTROLLER;

  private final CitizenService citizenService;

  public CitizenController(CitizenService citizenService) {
    this.citizenService = citizenService;
  }

  @GetMapping
  @Operation(summary = "Get STI protection procedure data belonging to a user.")
  @Transactional(readOnly = true)
  public GetCitizenProcedureResponse getCitizenProcedure(@AuthenticationPrincipal Jwt principal) {
    return StiProtectionProcedureMapper.toCitizenInterfaceType(
        citizenService.getProcedure(principal));
  }
}
