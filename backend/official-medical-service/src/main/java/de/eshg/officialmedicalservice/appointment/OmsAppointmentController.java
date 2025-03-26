/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment;

import de.eshg.officialmedicalservice.appointment.api.BookingInfoDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = OmsAppointmentController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "OmsAppointment")
public class OmsAppointmentController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String APPOINTMENT_URL = "/appointments";

  private final OmsAppointmentService omsAppointmentService;

  public OmsAppointmentController(OmsAppointmentService omsAppointmentService) {
    this.omsAppointmentService = omsAppointmentService;
  }

  @PatchMapping(path = APPOINTMENT_URL + "/{id}/book")
  @Operation(summary = "Create a booking for an appointment")
  public void bookAppointment(
      @PathVariable("id") UUID appointmentId, @Valid @RequestBody BookingInfoDto request) {
    omsAppointmentService.bookAppointmentEmployee(appointmentId, request);
  }

  @PatchMapping(path = APPOINTMENT_URL + "/{id}/cancel")
  @Operation(summary = "Cancel an appointment")
  public void cancelAppointment(
      @PathVariable("id") UUID appointmentId,
      @Valid @RequestBody(required = false) String reasonForRejection) {
    omsAppointmentService.cancelAppointmentEmployee(appointmentId, reasonForRejection);
  }

  @PatchMapping(path = APPOINTMENT_URL + "/{id}/close")
  @Operation(summary = "close an appointment")
  public void closeAppointment(@PathVariable("id") UUID appointmentId) {
    omsAppointmentService.closeAppointmentEmployee(appointmentId);
  }
}
