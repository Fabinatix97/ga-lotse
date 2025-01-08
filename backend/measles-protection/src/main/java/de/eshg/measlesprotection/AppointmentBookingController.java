/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.measlesprotection.api.BookAppointmentRequest;
import de.eshg.measlesprotection.api.MeaslesProtectionProcedureDto;
import de.eshg.measlesprotection.mapper.ToDtoMappers;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER)
@Tag(name = "AppointmentBooking")
public class AppointmentBookingController {

  private final AppointmentService appointmentService;
  private final MeaslesProtectionService measlesProtectionService;

  public AppointmentBookingController(
      AppointmentService appointmentService, MeaslesProtectionService measlesProtectionService) {
    this.appointmentService = appointmentService;
    this.measlesProtectionService = measlesProtectionService;
  }

  @GetMapping("/free-appointments")
  @Operation(summary = "Get free appointments.")
  GetFreeAppointmentsResponse getFreeMeaslesProtectionAppointments() {
    List<AppointmentDto> appointments = appointmentService.getFreeAppointments();
    return new GetFreeAppointmentsResponse(appointments);
  }

  @PostMapping("/{procedureId}/book-appointment")
  @Operation(summary = "Book or update an appointment for a given procedure.")
  MeaslesProtectionProcedureDto bookAppointmentForProcedure(
      @PathVariable("procedureId") @ProtectedProcedure UUID procedureId,
      @Valid @RequestBody BookAppointmentRequest request) {
    appointmentService.bookAppointment(procedureId, request.start(), request.end());
    ProcedureDetailsData procedureDetails =
        measlesProtectionService.findAndAugmentProcedureByExternalId(procedureId);
    return ToDtoMappers.toMeaslesProtectionProcedure(procedureDetails);
  }

  @DeleteMapping("/{procedureId}/delete-appointment")
  @Operation(summary = "Remove an appointment for a given procedure.")
  MeaslesProtectionProcedureDto deleteAppointmentForProcedure(
      @PathVariable("procedureId") @ProtectedProcedure UUID procedureId) {
    appointmentService.deleteAppointment(procedureId);
    ProcedureDetailsData procedureDetails =
        measlesProtectionService.findAndAugmentProcedureByExternalId(procedureId);
    return ToDtoMappers.toMeaslesProtectionProcedure(procedureDetails);
  }
}
