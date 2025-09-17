/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import static de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationConfigController.BASE_URL;
import static de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationMapper.mapToDto;
import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_CONFIG_API;

import de.eshg.officialmedicalservice.config.api.GetOmsAppointmentStandardDurationsResponse;
import de.eshg.officialmedicalservice.config.api.OmsAppointmentStandardDurationsDto;
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
@RequestMapping(BASE_URL)
@Tag(name = "OmsAppointmentStandardDurationConfig")
public class OmsAppointmentStandardDurationConfigController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_CONFIG_API;

  private final OmsAppointmentStandardDurationService appointmentStandardDurationService;

  public OmsAppointmentStandardDurationConfigController(
      OmsAppointmentStandardDurationService appointmentStandardDurationService) {
    this.appointmentStandardDurationService = appointmentStandardDurationService;
  }

  @Operation(summary = "Get standard durations for official medical service appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard durations if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetOmsAppointmentStandardDurationsResponse getStandardDurationsConfig() {
    return mapToDto(appointmentStandardDurationService.getConfig());
  }

  @Operation(summary = "Update the standard durations for official medical service appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid
          @RequestBody
          @Parameter(
              description =
                  "A request containing the standard durations. All standard durations must be set.")
          OmsAppointmentStandardDurationsDto omsAppointmentStandardDurationsDto) {
    appointmentStandardDurationService.updateAppointmentStandardDurations(
        mapToDomain(omsAppointmentStandardDurationsDto));
  }
}
