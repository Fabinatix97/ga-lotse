/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingAppointmentStandardDurationMapper.mapToInfectionBriefingAppointmentStandardDurationsDto;

import de.eshg.infectionbriefing.api.InfectionBriefingAppointmentStandardDurationsDto;
import de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(InfectionBriefingAppointmentStandardDurationController.BASE_URL)
@Tag(name = "InfectionBriefingAppointmentStandardDuration")
public class InfectionBriefingAppointmentStandardDurationController {

  public static final String BASE_URL = LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_INFO_API;

  private final InfectionBriefingAppointmentStandardDurationService service;

  public InfectionBriefingAppointmentStandardDurationController(
      InfectionBriefingAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard duration for infection briefing appointments")
  @ApiResponse(
      responseCode = "200",
      description = "A response containing the standard duration if initialized.")
  @GetMapping
  @Transactional(readOnly = true)
  public InfectionBriefingAppointmentStandardDurationsDto getStandardDurations() {
    return mapToInfectionBriefingAppointmentStandardDurationsDto(service.getConfig());
  }
}
