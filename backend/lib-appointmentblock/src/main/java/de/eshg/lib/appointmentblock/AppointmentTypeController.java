/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentTypeConfigDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentTypesResponse;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentTypeRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** This controller should be removed when the legacy appointmentblock config FE is deleted */
@RestController
@RequestMapping(AppointmentTypeController.BASE_URL)
@Tag(name = "AppointmentType")
public class AppointmentTypeController {

  static final String BASE_URL = BaseUrls.LibAppointmentBlock.APPOINTMENT_TYPE_API;

  private final AppointmentTypeService appointmentTypeService;

  public AppointmentTypeController(AppointmentTypeService appointmentTypeService) {
    this.appointmentTypeService = appointmentTypeService;
  }

  @Operation(summary = "Gets all Appointment Types")
  @GetMapping
  @Transactional(readOnly = true)
  public GetAppointmentTypesResponse getAppointmentTypes() {
    return appointmentTypeService.getAppointmentTypes();
  }

  @Operation(summary = "Gets one Appointment Type by ID")
  @GetMapping("/{id}")
  @Transactional(readOnly = true)
  public AppointmentTypeConfigDto getOneAppointmentType(@PathVariable("id") UUID id) {
    return appointmentTypeService.getOneAppointmentType(id);
  }

  @Operation(summary = "Modifies an existing Appointment Type")
  @PutMapping("/{id}")
  @Transactional
  public AppointmentTypeConfigDto updateAppointmentType(
      @PathVariable("id") UUID id, @RequestBody @Valid UpdateAppointmentTypeRequest request) {
    return appointmentTypeService.updateAppointmentType(id, request);
  }
}
