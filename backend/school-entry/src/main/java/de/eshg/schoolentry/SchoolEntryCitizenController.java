/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.citizen.*;
import de.eshg.schoolentry.api.citizen.GetCitizenProcedureResponse.CitizenChildDto;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(SchoolEntryCitizenController.BASE_URL)
@Tag(name = "SchoolEntryCitizen")
public class SchoolEntryCitizenController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.SCHOOL_ENTRY_CITIZEN_CONTROLLER;
  public static final int MAX_ALLOWED_APPOINTMENT_CHANGES = 2;

  private final SchoolEntryCitizenService schoolEntryCitizenService;
  private final PersonApi personApi;
  private final Validator validator;

  public SchoolEntryCitizenController(
      SchoolEntryCitizenService schoolEntryCitizenService,
      PersonApi personApi,
      Validator validator) {
    this.schoolEntryCitizenService = schoolEntryCitizenService;
    this.personApi = personApi;
    this.validator = validator;
  }

  @GetMapping("/procedure")
  @Transactional(readOnly = true)
  public GetCitizenProcedureResponse getSelfProcedureAsCitizen(
      @AuthenticationPrincipal Jwt principal) {
    SchoolEntryProcedure schoolEntryProcedure = getSchoolEntryProcedure(principal);

    GetPersonFileStateResponse child =
        personApi.getPersonFileState(schoolEntryProcedure.getChildIdFromCentralFile());

    int appointmentChangesLeft =
        calculateAppointmentChangesLeft(schoolEntryProcedure.getAppointmentChangesByCitizen());

    return new GetCitizenProcedureResponse(
        schoolEntryProcedure.getAppointment().getAppointmentStart(),
        schoolEntryProcedure.getAppointment().getAppointmentEnd(),
        schoolEntryCitizenService.getAppointmentAddress(schoolEntryProcedure),
        new CitizenChildDto(child.firstName(), child.lastName(), child.dateOfBirth()),
        !schoolEntryProcedure.getAnamnesis().hasEdits(),
        appointmentChangesLeft,
        ProcedureStatus.isClosed(schoolEntryProcedure.getProcedureStatus()));
  }

  private int calculateAppointmentChangesLeft(int changes) {
    return MAX_ALLOWED_APPOINTMENT_CHANGES - changes;
  }

  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetCitizenFreeAppointmentsResponse getSelfFreeAppointmentsAsCitizen(
      @AuthenticationPrincipal Jwt principal) {
    SchoolEntryProcedure schoolEntryProcedure = getSchoolEntryProcedure(principal);

    List<AppointmentDto> freeAppointments =
        schoolEntryCitizenService.getFreeAppointments(schoolEntryProcedure);

    return new GetCitizenFreeAppointmentsResponse(freeAppointments);
  }

  @PutMapping("/appointment")
  @Transactional
  public void updateAppointmentAsCitizen(
      @AuthenticationPrincipal Jwt principal,
      @Valid @RequestBody UpdateCitizenAppointmentRequest request) {
    SchoolEntryProcedure schoolEntryProcedure = getSchoolEntryProcedureForUpdate(principal);

    validator.validateAppointmentChanges(schoolEntryProcedure);
    AppointmentDto newAppointment = request.newAppointment();

    schoolEntryCitizenService.updateAppointment(
        schoolEntryProcedure, newAppointment.start(), newAppointment.end());
  }

  private SchoolEntryProcedure getSchoolEntryProcedure(Jwt principal) {
    UUID citizenUserId = getCitizenUserId(principal);
    return schoolEntryCitizenService.findOrThrow(citizenUserId);
  }

  private SchoolEntryProcedure getSchoolEntryProcedureForUpdate(Jwt principal) {
    UUID citizenUserId = getCitizenUserId(principal);
    return schoolEntryCitizenService.findForUpdateOrThrow(citizenUserId);
  }

  private static UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }

  @PutMapping("/anamnesis")
  @Transactional
  public void addAnamnesisAsCitizen(
      @AuthenticationPrincipal Jwt principal,
      @Valid @RequestBody AddCitizenAnamnesisRequest request) {
    SchoolEntryProcedure schoolEntryProcedure = getSchoolEntryProcedureForUpdate(principal);

    if (schoolEntryProcedure.getAnamnesis().hasEdits()) {
      throw new BadRequestException(
          "submitting citizen anamnesis is not allowed as there were already edits to the anamnesis");
    }

    validator.validateCitizenAnamnesis(request.anamnesis());

    schoolEntryCitizenService.addCitizenAnamnesis(schoolEntryProcedure, request.anamnesis());
  }
}
