/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.citizenauth;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.PostAnamnesisRequest;
import de.eshg.officialmedicalservice.citizenauth.api.GetCitizenProcedureDetailsResponse;
import de.eshg.rest.service.security.config.BaseUrls.OfficialMedicalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = CitizenAuthController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenAuth")
public class CitizenAuthController {
  public static final String BASE_URL = OfficialMedicalService.CITIZEN_AUTH_API;
  public static final String PROCEDURE_URL = "/procedure";
  public static final String CANCEL_APPOINTMENT_URL = "/cancel";
  public static final String APPOINTMENT_URL = "/appointment";
  public static final String DOCUMENT_URL = "/document";
  public static final String ANAMNESIS_URL = "/anamnesis";

  private final CitizenAuthProcedureService citizenAuthProcedureService;

  public CitizenAuthController(CitizenAuthProcedureService citizenAuthProcedureService) {
    this.citizenAuthProcedureService = citizenAuthProcedureService;
  }

  @GetMapping(path = PROCEDURE_URL)
  @Operation(summary = "Get procedure details")
  public GetCitizenProcedureDetailsResponse getProcedureDetails(
      @AuthenticationPrincipal Jwt principal) {
    return citizenAuthProcedureService.getProcedureDetails(getCitizenUserId(principal));
  }

  @PatchMapping(
      path = PROCEDURE_URL + APPOINTMENT_URL + "/{appointmentId}" + CANCEL_APPOINTMENT_URL)
  @Operation(summary = "Cancel appointment")
  public void cancelAppointmentByCitizen(
      @AuthenticationPrincipal Jwt principal, @PathVariable("appointmentId") UUID appointmentId) {
    citizenAuthProcedureService.cancelAppointmentByCitizen(
        getCitizenUserId(principal), appointmentId);
  }

  @PutMapping(path = PROCEDURE_URL + APPOINTMENT_URL + "/{appointmentId}")
  @Operation(summary = "Book or rebook appointment")
  public void putAppointmentCitizen(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("appointmentId") UUID appointmentId,
      @RequestBody @Valid AppointmentDto appointmentDto) {
    citizenAuthProcedureService.putAppointmentByCitizen(
        getCitizenUserId(principal), appointmentId, appointmentDto);
  }

  @PostMapping(
      path = PROCEDURE_URL + DOCUMENT_URL + "/{documentId}",
      consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload files to a document of an oms procedure")
  public void postDocumentCitizen(
      @AuthenticationPrincipal Jwt principal,
      @PathVariable("documentId") UUID documentId,
      @RequestPart(value = "files") List<MultipartFile> files) {
    citizenAuthProcedureService.postDocumentByCitizen(
        getCitizenUserId(principal), documentId, files);
  }

  @PostMapping(path = PROCEDURE_URL + ANAMNESIS_URL)
  @Operation(summary = "Posts anamnesis")
  public void postAnamnesisCitizen(
      @AuthenticationPrincipal Jwt principal, @RequestBody @Valid PostAnamnesisRequest request) {
    citizenAuthProcedureService.postAnamnesis(getCitizenUserId(principal), request);
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }
}
