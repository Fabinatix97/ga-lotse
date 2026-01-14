/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationController.BASE_URL;
import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationMapper.mapToHivStiConsultationAppointmentStandardDurationsDto;
import static de.eshg.stiprotection.config.StiProtectionAppointmentStandardDurationMapper.mapToSexWorkAppointmentStandardDurationsDto;

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
@Tag(name = "StiProtectionAppointmentStandardDuration")
public class StiProtectionAppointmentStandardDurationController {

  public static final String BASE_URL = LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_INFO_API;
  public static final String SEX_WORK = "sex-work";
  public static final String HIV_STI_CONSULTATION = "hiv-sti-consultation";

  private final StiProtectionAppointmentStandardDurationService service;

  public StiProtectionAppointmentStandardDurationController(
      StiProtectionAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(summary = "Get standard durations for sex work consultation appointments")
  @ApiResponse(responseCode = "200", description = "A response containing the standard durations.")
  @Transactional(readOnly = true)
  @GetMapping(SEX_WORK)
  public SexWorkAppointmentStandardDurationsDto getSexWorkAppointmentStandardDurations() {
    return mapToSexWorkAppointmentStandardDurationsDto(service.getConfig());
  }

  @Operation(summary = "Get standard durations for hiv/sti consultation appointments")
  @ApiResponse(responseCode = "200", description = "A response containing the standard durations.")
  @Transactional(readOnly = true)
  @GetMapping(HIV_STI_CONSULTATION)
  public HivStiConsultationAppointmentStandardDurationsDto
      getHivStiConsultationAppointmentStandardDurations() {
    return mapToHivStiConsultationAppointmentStandardDurationsDto(service.getConfig());
  }
}
