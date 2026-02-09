/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.PublicCitizenController.BASE_URL;
import static de.eshg.infectionbriefing.mapper.InfectionBriefingAppointmentTypeMapper.toDomainType;

import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingAppointTypeDto;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "PublicCitizen")
public class PublicCitizenController {

  private static final Logger log = LoggerFactory.getLogger(PublicCitizenController.class);

  public static final String BASE_URL = InfectionBriefing.PUBLIC_CITIZEN_CONTROLLER;

  private final CreateNewCertificateProcedureService createNewCertificateProcedureService;
  private final MailService mailService;
  private final AppointmentBlockService appointmentBlockService;

  public PublicCitizenController(
      CreateNewCertificateProcedureService createNewCertificateProcedureService,
      MailService mailService,
      AppointmentBlockService appointmentBlockService) {
    this.createNewCertificateProcedureService = createNewCertificateProcedureService;
    this.mailService = mailService;
    this.appointmentBlockService = appointmentBlockService;
  }

  @Transactional
  @PostMapping("appointment/new-certificate")
  public BookNewCertificateAppointmentResponse bookNewCertificateAppointment(
      @Valid @RequestBody BookNewCertificateAppointmentRequest request) {
    return new BookNewCertificateAppointmentResponse(
        createNewCertificateProcedureService.createNewCertificateProcedure(request),
        sendConfirmationMail(request));
  }

  private boolean sendConfirmationMail(BookNewCertificateAppointmentRequest request) {
    try {
      mailService.sendAppointmentConfirmationMail(request.startTime(), request.applicant().email());
      return true;
    } catch (Exception e) {
      log.warn("Cannot send confirmation e-mail", e);
      return false;
    }
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping(path = "free-appointments", produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") InfectionBriefingAppointTypeDto appointmentType) {
    return new GetFreeAppointmentsResponse(
        appointmentBlockService.getFreeAppointments(
            null, null, toDomainType(appointmentType), null, null));
  }
}
