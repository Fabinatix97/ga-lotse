/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetProcedureStepServicesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchAppointmentRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchEarliestDateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = ProcedureStepController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "ProcedureStep")
public class ProcedureStepController {
  public static final String BASE_URL = BaseUrls.TravelMedicine.PROCEDURE_STEP_CONTROLLER;
  public static final String APPOINTMENT_URL = "/appointment";
  public static final String EARLIEST_DATE_URL = "/earliest-date";
  public static final String SERVICE_URL = "/services";
  private final ProcedureStepService procedureStepService;

  public ProcedureStepController(ProcedureStepService procedureStepService) {
    this.procedureStepService = procedureStepService;
  }

  @GetMapping(path = "/{id}" + SERVICE_URL)
  @Operation(summary = "Get all services of a procedure step")
  @Transactional(readOnly = true)
  public GetProcedureStepServicesResponse getProcedureStepServices(
      @PathVariable("id") UUID procedureStepId) {
    return procedureStepService.getProcedureStepServices(procedureStepId);
  }

  @PatchMapping(path = "/{id}" + APPOINTMENT_URL)
  @Operation(summary = "Patches appointment data of an given procedure step")
  @Transactional
  public void patchAppointment(
      @PathVariable("id") UUID procedureStepId,
      @RequestBody @Valid PatchAppointmentRequest appointmentRequest) {
    procedureStepService.updateAppointment(procedureStepId, appointmentRequest);
  }

  @PatchMapping(path = "/{id}" + EARLIEST_DATE_URL)
  @Operation(summary = "Patches earliest date for self booking of an given procedure step")
  @Transactional
  public void patchEarliestDate(
      @PathVariable("id") UUID procedureStepId,
      @RequestBody @Valid PatchEarliestDateRequest patchEarliestDateRequest) {
    procedureStepService.updateEarliestDate(procedureStepId, patchEarliestDateRequest);
  }

  @DeleteMapping(path = "/{procedureStepId}" + APPOINTMENT_URL)
  @Operation(summary = "Cancel an appointment from employee portal.")
  @Transactional
  public void deleteAppointmentEp(@PathVariable("procedureStepId") UUID procedureStepId) {
    procedureStepService.cancelAppointmentByEmployee(procedureStepId);
  }
}
