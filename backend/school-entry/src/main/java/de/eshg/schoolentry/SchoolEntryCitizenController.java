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
import de.eshg.schoolentry.api.citizen.*;
import de.eshg.schoolentry.api.citizen.GetCitizenProcedureResponse.CitizenChildDto;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

  private final SchoolEntryProperties schoolEntryProperties;

  public SchoolEntryCitizenController(
      SchoolEntryCitizenService schoolEntryCitizenService,
      PersonApi personApi,
      Validator validator,
      SchoolEntryProperties schoolEntryProperties) {
    this.schoolEntryCitizenService = schoolEntryCitizenService;
    this.personApi = personApi;
    this.validator = validator;
    this.schoolEntryProperties = schoolEntryProperties;
    this.privacyNotice = toResource(schoolEntryProperties.getPrivacyNoticeLocation());
    this.privacyPolicy = toResource(schoolEntryProperties.getPrivacyPolicyLocation());
  }

  private static Resource toResource(URI documentLocation) {
    try {
      UrlResource urlResource = new UrlResource(documentLocation);
      return urlResource;
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }
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

  @GetMapping(path = "/opening-hours")
  @Operation(summary = "Get the official opening hours.")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {
    SchoolEntryProperties.OpeningHours openingHours = schoolEntryProperties.getOpeningHours();
    return new GetOpeningHoursResponse(openingHours.de(), openingHours.en());
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
    String filename = privacyDocument.getFilename();
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(privacyDocument);
  }
}
