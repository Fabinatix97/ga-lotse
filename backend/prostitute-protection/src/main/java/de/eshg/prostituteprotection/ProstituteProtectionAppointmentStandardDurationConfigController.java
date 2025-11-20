/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import static de.eshg.prostituteprotection.mapper.ProstituteProtectionAppointmentStandardDurationMapper.mapToDomain;
import static de.eshg.prostituteprotection.mapper.ProstituteProtectionAppointmentStandardDurationMapper.mapToDto;
import static de.eshg.rest.service.security.config.BaseUrls.LibAppointmentBlock.APPOINTMENT_STANDARD_DURATION_CONFIG_API;

import de.eshg.prostituteprotection.api.GetProstituteProtectionAppointmentStandardDurationsResponse;
import de.eshg.prostituteprotection.api.ProstituteProtectionAppointmentStandardDurationsDto;
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
@RequestMapping(ProstituteProtectionAppointmentStandardDurationConfigController.BASE_URL)
@Tag(name = "ProstituteProtectionAppointmentStandardDurationConfig")
public class ProstituteProtectionAppointmentStandardDurationConfigController {

  public static final String BASE_URL = APPOINTMENT_STANDARD_DURATION_CONFIG_API;

  private final ProstituteProtectionAppointmentStandardDurationService service;

  public ProstituteProtectionAppointmentStandardDurationConfigController(
      ProstituteProtectionAppointmentStandardDurationService service) {
    this.service = service;
  }

  @Operation(
      summary = "Get the standard duration for prostitute protection consultation appointments")
  @ApiResponse(
      responseCode = "200",
      description =
          "A response containing the standard duration if initialized, or an empty response body otherwise.")
  @GetMapping
  @Transactional(readOnly = true)
  public GetProstituteProtectionAppointmentStandardDurationsResponse getStandardDurationsConfig() {
    return mapToDto(service.getConfig());
  }

  @Operation(
      summary = "Update the standard duration for prostitute protection consultation appointments")
  @PutMapping
  @Transactional
  public void updateStandardDurations(
      @Valid @RequestBody @Parameter(description = "A request containing the standard duration.")
          ProstituteProtectionAppointmentStandardDurationsDto request) {
    service.updateAppointmentStandardDurations(mapToDomain(request));
  }
}
