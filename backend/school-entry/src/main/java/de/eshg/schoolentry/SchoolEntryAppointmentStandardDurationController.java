/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.SchoolEntryAppointmentStandardDurationController.BASE_URL;
import static de.eshg.schoolentry.mapper.SchoolEntryAppointmentStandardDurationMapper.mapToSchoolEntryAppointmentStandardDurationsDto;

import de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock;
import de.eshg.schoolentry.api.configuration.SchoolEntryAppointmentStandardDurationsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "SchoolEntryAppointmentStandardDuration")
public class SchoolEntryAppointmentStandardDurationController {

  public static final String BASE_URL = LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_INFO_API;

  private final SchoolEntryAppointmentStandardDurationService service;

  public SchoolEntryAppointmentStandardDurationController(
      SchoolEntryAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get the standard durations for school entry appointments")
  @ApiResponse(responseCode = "200", description = "A response containing the standard durations.")
  @GetMapping
  @Transactional(readOnly = true)
  public SchoolEntryAppointmentStandardDurationsDto getStandardDurations() {
    return mapToSchoolEntryAppointmentStandardDurationsDto(service.getConfig());
  }
}
