/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import static de.eshg.prostituteprotection.mapper.ProstituteProtectionAppointmentStandardDurationMapper.mapToProstituteProtectionAppointmentStandardDurationsDto;

import de.eshg.prostituteprotection.api.ProstituteProtectionAppointmentStandardDurationsDto;
import de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ProstituteProtectionAppointmentStandardDurationController.BASE_URL)
@Tag(name = "ProstituteProtectionAppointmentStandardDuration")
public class ProstituteProtectionAppointmentStandardDurationController {

  public static final String BASE_URL = LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_INFO_API;

  private final ProstituteProtectionAppointmentStandardDurationService service;

  public ProstituteProtectionAppointmentStandardDurationController(
      ProstituteProtectionAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(
      summary = "Get the standard duration for prostitute protection consultation appointments")
  @ApiResponse(
      responseCode = "200",
      description = "A response containing the standard duration if initialized.")
  @GetMapping
  @Transactional(readOnly = true)
  public ProstituteProtectionAppointmentStandardDurationsDto getStandardDurations() {
    return mapToProstituteProtectionAppointmentStandardDurationsDto(service.getConfig());
  }
}
