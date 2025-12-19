/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import static de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationController.BASE_URL;
import static de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationMapper.mapToOmsAppointmentStandardDurationsDto;

import de.eshg.officialmedicalservice.config.api.OmsAppointmentStandardDurationsDto;
import de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "OmsAppointmentStandardDuration")
public class OmsAppointmentStandardDurationController {

  public static final String BASE_URL = LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_INFO_API;

  private final OmsAppointmentStandardDurationService service;

  public OmsAppointmentStandardDurationController(OmsAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get standard durations for official medical service appointments")
  @ApiResponse(responseCode = "200", description = "A response containing the standard durations.")
  @GetMapping
  @Transactional(readOnly = true)
  public OmsAppointmentStandardDurationsDto getStandardDurations() {
    return mapToOmsAppointmentStandardDurationsDto(service.getConfig());
  }
}
