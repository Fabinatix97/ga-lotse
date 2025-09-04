/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentBlockDefaultAvailabilityDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppointmentBlockDefaultAvailabilityController.BASE_URL)
@ConditionalOnBean(AppointmentBlockDefaultAvailabilityService.class)
@Tag(name = "AppointmentBlockDefaultAvailability")
public class AppointmentBlockDefaultAvailabilityController {

  static final String BASE_URL =
      BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_DEFAULT_AVAILABILITY_API;

  private final AppointmentBlockDefaultAvailabilityService
      appointmentBlockDefaultAvailabilityService;

  public AppointmentBlockDefaultAvailabilityController(
      AppointmentBlockDefaultAvailabilityService appointmentBlockDefaultAvailabilityService) {
    this.appointmentBlockDefaultAvailabilityService = appointmentBlockDefaultAvailabilityService;
  }

  @Operation(summary = "Gets the default availability flags")
  @GetMapping
  @Transactional(readOnly = true)
  public AppointmentBlockDefaultAvailabilityDto getDefaultFlags() {
    return appointmentBlockDefaultAvailabilityService.getDefaultFlags();
  }
}
