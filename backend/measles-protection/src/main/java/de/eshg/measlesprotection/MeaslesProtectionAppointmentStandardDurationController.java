/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.MeaslesProtectionAppointmentStandardDurationController.BASE_URL;
import static de.eshg.measlesprotection.mapper.MeaslesProtectionAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.measlesprotection.mapper.MeaslesProtectionAppointmentStandardDurationMapper.mapToDto;
import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_API;

import de.eshg.measlesprotection.api.GetMeaslesProtectionAppointmentStandardDurationsResponse;
import de.eshg.measlesprotection.api.MeaslesProtectionAppointmentStandardDurationsDto;
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
@Tag(name = "MeaslesProtectionAppointmentStandardDuration")
public class MeaslesProtectionAppointmentStandardDurationController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_API;

  private final MeaslesProtectionAppointmentStandardDurationService service;

  public MeaslesProtectionAppointmentStandardDurationController(
      MeaslesProtectionAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(
      summary = "Get the standard duration for measles protection proof submission appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard duration if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetMeaslesProtectionAppointmentStandardDurationsResponse getStandardDurations() {
    return mapToDto(service.getConfig());
  }

  @Operation(
      summary = "Update the standard duration for measles protection proof submission appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid @RequestBody @Parameter(description = "A request containing the standard duration.")
          MeaslesProtectionAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
