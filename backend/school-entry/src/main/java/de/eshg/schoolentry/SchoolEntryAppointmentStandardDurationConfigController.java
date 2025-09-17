/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_CONFIG_API;
import static de.eshg.schoolentry.SchoolEntryAppointmentStandardDurationConfigController.BASE_URL;
import static de.eshg.schoolentry.mapper.SchoolEntryAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.schoolentry.mapper.SchoolEntryAppointmentStandardDurationMapper.mapToDto;

import de.eshg.schoolentry.api.configuration.GetSchoolEntryAppointmentStandardDurationsResponse;
import de.eshg.schoolentry.api.configuration.SchoolEntryAppointmentStandardDurationsDto;
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
@Tag(name = "SchoolEntryAppointmentStandardDurationConfig")
public class SchoolEntryAppointmentStandardDurationConfigController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_CONFIG_API;

  private final SchoolEntryAppointmentStandardDurationService service;

  public SchoolEntryAppointmentStandardDurationConfigController(
      SchoolEntryAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard durations for school entry appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard durations if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetSchoolEntryAppointmentStandardDurationsResponse getStandardDurationsConfig() {
    return mapToDto(service.getConfig());
  }

  @Operation(summary = "Update the standard durations for school entry appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid
          @RequestBody
          @Parameter(
              description =
                  "A request containing the standard durations. All standard durations must be set.")
          SchoolEntryAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
