/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static de.eshg.lib.appointmentblock.mapper.AppointmentBlockDefaultAvailabilityMapper.mapToDomain;

import de.eshg.lib.appointmentblock.api.AppointmentBlockDefaultAvailabilityDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockDefaultAvailabilityFlagsResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppointmentBlockDefaultAvailabilityConfigController.BASE_URL)
@ConditionalOnBean(AppointmentBlockDefaultAvailabilityService.class)
@Tag(name = "AppointmentBlockDefaultAvailabilityConfig")
public class AppointmentBlockDefaultAvailabilityConfigController {

  static final String BASE_URL =
      BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_DEFAULT_AVAILABILITY_CONFIG_API;

  private final AppointmentBlockDefaultAvailabilityService
      appointmentBlockDefaultAvailabilityService;

  public AppointmentBlockDefaultAvailabilityConfigController(
      AppointmentBlockDefaultAvailabilityService appointmentBlockDefaultAvailabilityService) {
    this.appointmentBlockDefaultAvailabilityService = appointmentBlockDefaultAvailabilityService;
  }

  @Operation(summary = "Gets the default availability flags")
  @GetMapping
  @Transactional(readOnly = true)
  public GetAppointmentBlockDefaultAvailabilityFlagsResponse getConfiguredDefaultFlags() {
    return new GetAppointmentBlockDefaultAvailabilityFlagsResponse(
        appointmentBlockDefaultAvailabilityService.getConfiguredDefaultFlags());
  }

  @Operation(summary = "Modifies the default availability flags")
  @PutMapping
  @Transactional
  public void updateDefaultFlags(
      @Valid
          @RequestBody
          @Parameter(description = "A request containing the default flags. All flags must be set.")
          AppointmentBlockDefaultAvailabilityDto request) {
    appointmentBlockDefaultAvailabilityService.updateDefaultFlags(mapToDomain(request));
  }
}
