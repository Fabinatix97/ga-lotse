/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.InfectionBriefingAppointmentController.BASE_URL;

import de.eshg.infectionbriefing.api.BookAppointmentResponse;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentByEmployeeRequest;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentByEmployeeRequest;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = BASE_URL)
@Tag(name = "InfectionBriefingAppointment")
public class InfectionBriefingAppointmentController {

  public static final String BASE_URL = InfectionBriefing.APPOINTMENT_CONTROLLER;

  private final CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService;

  public InfectionBriefingAppointmentController(
      CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService) {
    this.createInfectionBriefingProcedureService = createInfectionBriefingProcedureService;
  }

  @PostMapping(path = "/new-certificate")
  @Transactional
  public BookAppointmentResponse bookNewCertificateAppointmentByEmployee(
      @Valid @RequestBody BookNewCertificateAppointmentByEmployeeRequest request) {
    return createInfectionBriefingProcedureService.createNewCertificateProcedureByEmployee(request);
  }

  @PostMapping(path = "/replacement-certificate")
  @Transactional
  public BookAppointmentResponse bookReplacementCertificateByEmployee(
      @Valid @RequestBody BookReplacementCertificateAppointmentByEmployeeRequest request) {
    return createInfectionBriefingProcedureService.createReplacementCertificateProcedureByEmployee(
        request);
  }
}
