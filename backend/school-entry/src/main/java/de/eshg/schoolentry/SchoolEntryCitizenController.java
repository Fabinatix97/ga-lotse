/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.citizen.AddCitizenAnamnesisRequest;
import de.eshg.schoolentry.api.citizen.GetCitizenFreeAppointmentsResponse;
import de.eshg.schoolentry.api.citizen.GetCitizenProcedureResponse;
import de.eshg.schoolentry.api.citizen.GetCitizenProcedureResponse.CitizenChildDto;
import de.eshg.schoolentry.api.citizen.UpdateCitizenAppointmentRequest;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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

  private final Resource privacyNotice;
  private final Resource privacyPolicy;

  public SchoolEntryCitizenController(
      SchoolEntryCitizenService schoolEntryCitizenService,
      PersonApi personApi,
      Validator validator,
      @Value("classpath:templates/documents/privacy_notice.pdf") Resource privacyNotice,
      @Value("classpath:templates/documents/privacy_policy.pdf") Resource privacyPolicy) {
    this.schoolEntryCitizenService = schoolEntryCitizenService;
    this.personApi = personApi;
    this.validator = validator;
    this.privacyNotice = privacyNotice;
    this.privacyPolicy = privacyPolicy;
  }

  @GetMapping
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

    Validator.validateProcedureStatusNotClosed(schoolEntryProcedure);
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
    Validator.validateProcedureStatusNotClosed(schoolEntryProcedure);

    if (schoolEntryProcedure.getAnamnesis().hasEdits()) {
      throw new BadRequestException(
          "submitting citizen anamnesis is not allowed as there were already edits to the anamnesis");
    }

    schoolEntryCitizenService.addCitizenAnamnesis(schoolEntryProcedure, request.anamnesis());
  }

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return getPrivacyDocument(privacyNotice);
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return getPrivacyDocument(privacyPolicy);
  }

  private static ResponseEntity<Resource> getPrivacyDocument(Resource privacyDocument) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            fileAttachment(privacyDocument.getFilename()).toString())
        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
        .body(privacyDocument);
  }

  private static ContentDisposition fileAttachment(String filename) {
    return file(filename, ContentDisposition.attachment());
  }

  private static ContentDisposition file(String filename, ContentDisposition.Builder builder) {
    return builder.name("file").filename(filename).build();
  }
}
