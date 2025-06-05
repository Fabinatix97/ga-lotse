/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import static de.eshg.medsabroad.MedsAbroadAppointmentStandardDurationController.BASE_URL;
import static de.eshg.medsabroad.mapper.MedsAbroadAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.medsabroad.mapper.MedsAbroadAppointmentStandardDurationMapper.mapToDto;
import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_API;

import de.eshg.medsabroad.api.GetMedsAbroadAppointmentStandardDurationsResponse;
import de.eshg.medsabroad.api.MedsAbroadAppointmentStandardDurationsDto;
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
@Tag(name = "MedsAbroadAppointmentStandardDuration")
public class MedsAbroadAppointmentStandardDurationController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_API;

  private final MedsAbroadAppointmentStandardDurationService service;

  public MedsAbroadAppointmentStandardDurationController(
      MedsAbroadAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard duration for meds abroad certification appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard duration if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetMedsAbroadAppointmentStandardDurationsResponse getStandardDurations() {
    return mapToDto(service.getConfig());
  }

  @Operation(summary = "Update the standard duration for meds abroad certification appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid @RequestBody @Parameter(description = "A request containing the standard duration.")
          MedsAbroadAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
