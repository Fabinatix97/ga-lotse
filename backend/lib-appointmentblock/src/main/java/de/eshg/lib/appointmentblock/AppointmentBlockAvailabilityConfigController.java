/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static de.eshg.lib.appointmentblock.mapper.AppointmentBlockDefaultAvailabilityMapper.mapToDomain;

import de.eshg.lib.appointmentblock.api.GetAppointmentBlockAvailabilityResponse;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentBlockAvailabilityRequest;
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
@RequestMapping(AppointmentBlockAvailabilityConfigController.BASE_URL)
@ConditionalOnBean(AppointmentBlockAvailabilityService.class)
@Tag(name = "AppointmentBlockAvailabilityConfig")
public class AppointmentBlockAvailabilityConfigController {

  static final String BASE_URL =
      BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_AVAILABILITY_CONFIG_API;

  private final AppointmentBlockAvailabilityService appointmentBlockDefaultAvailabilityService;

  public AppointmentBlockAvailabilityConfigController(
      AppointmentBlockAvailabilityService appointmentBlockAvailabilityService) {
    this.appointmentBlockDefaultAvailabilityService = appointmentBlockAvailabilityService;
  }

  @Operation(summary = "Gets the default availability")
  @GetMapping
  @Transactional(readOnly = true)
  public GetAppointmentBlockAvailabilityResponse getConfiguredAvailability() {
    return new GetAppointmentBlockAvailabilityResponse(
        appointmentBlockDefaultAvailabilityService.getConfiguredDefaultFlags(),
        appointmentBlockDefaultAvailabilityService.getConfiguredDefaultLeadTimes());
  }

  @Operation(summary = "Modifies the default availability")
  @PutMapping
  @Transactional
  public void updateAvailability(
      @Valid
          @RequestBody
          @Parameter(description = "A request containing the availability flags and lead times.")
          UpdateAppointmentBlockAvailabilityRequest request) {
    appointmentBlockDefaultAvailabilityService.updateAvailability(mapToDomain(request));
  }
}
