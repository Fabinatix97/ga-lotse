/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.citizenauth;

import de.eshg.infectionbriefing.InfectionBriefingAppointmentService;
import de.eshg.infectionbriefing.api.GetCitizenAppointmentResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = CitizenAuthController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenAuth")
public class CitizenAuthController {

  public static final String BASE_URL = BaseUrls.InfectionBriefing.CITIZEN_AUTH_CONTROLLER;

  public static final String CITIZEN_APPOINTMENT_URL = "/appointment";

  private final InfectionBriefingAppointmentService infectionBriefingAppointmentService;

  public CitizenAuthController(
      InfectionBriefingAppointmentService infectionBriefingAppointmentService) {
    this.infectionBriefingAppointmentService = infectionBriefingAppointmentService;
  }

  @GetMapping(CITIZEN_APPOINTMENT_URL)
  @Operation(summary = "Gets the appointment of the citizen")
  @Transactional(readOnly = true)
  public GetCitizenAppointmentResponse getCitizenAppointment(
      @AuthenticationPrincipal Jwt principal) {
    return infectionBriefingAppointmentService.getCitizenAppointment(getCitizenUserId(principal));
  }

  @DeleteMapping(CITIZEN_APPOINTMENT_URL)
  @Operation(summary = "Cancel an appointment from citizen portal.")
  @Transactional
  public void cancelCitizenAppointment(@AuthenticationPrincipal Jwt principal) {
    infectionBriefingAppointmentService.cancelAppointmentAndAbortDraftByCitizen(
        getCitizenUserId(principal));
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }
}
