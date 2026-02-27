/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.infectionbriefing.mapper.InfectionBriefingAppointmentStandardDurationMapper.mapToDto;
import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_CONFIG_API;

import de.eshg.infectionbriefing.api.GetInfectionBriefingAppointmentStandardDurationsResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingAppointmentStandardDurationsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(InfectionBriefingAppointmentStandardDurationConfigController.BASE_URL)
@Tag(name = "InfectionBriefingAppointmentStandardDurationConfig")
public class InfectionBriefingAppointmentStandardDurationConfigController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_CONFIG_API;

  private final InfectionBriefingAppointmentStandardDurationService service;

  public InfectionBriefingAppointmentStandardDurationConfigController(
      InfectionBriefingAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard duration for infection briefing consultation appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard duration if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetInfectionBriefingAppointmentStandardDurationsResponse getStandardDurationsConfig() {
    return mapToDto(service.getConfig());
  }

  @Operation(
      summary = "Update the standard duration for infection briefing consultation appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid @RequestBody @Parameter(description = "A request containing the standard duration.")
          InfectionBriefingAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
