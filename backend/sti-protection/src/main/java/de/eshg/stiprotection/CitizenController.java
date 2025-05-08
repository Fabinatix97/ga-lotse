/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.ResponseEntities;
import de.eshg.stiprotection.api.citizen.GetCitizenProcedureResponse;
import de.eshg.stiprotection.api.citizen.UpdateBookedAppointmentRequest;
import de.eshg.stiprotection.api.citizen.UpdatePinRequest;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import de.eshg.stiprotection.mapper.medicalhistory.MedicalHistoryMapper;
import de.eshg.stiprotection.persistence.Appointments;
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = CitizenController.BASE_URL)
@Tag(name = "Citizen")
public class CitizenController {
  public static final String BASE_URL = BaseUrls.StiProtection.CITIZEN_CONTROLLER;

  private final CitizenService citizenService;
  private final MedicalHistoryService medicalHistoryService;
  private final ProgressEntryUtil progressEntryUtil;
  private final AppointmentService appointmentService;
  private final StiProtectionProcedureService stiProtectionProcedureService;

  public CitizenController(
      CitizenService citizenService,
      MedicalHistoryService medicalHistoryService,
      ProgressEntryUtil progressEntryUtil,
      AppointmentService appointmentService,
      StiProtectionProcedureService stiProtectionProcedureService) {
    this.citizenService = citizenService;
    this.medicalHistoryService = medicalHistoryService;
    this.progressEntryUtil = progressEntryUtil;
    this.appointmentService = appointmentService;
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  @GetMapping("/procedure")
  @Operation(summary = "Get STI protection procedure data belonging to a user.")
  @Transactional(readOnly = true)
  public GetCitizenProcedureResponse getCitizenProcedure(@AuthenticationPrincipal Jwt principal) {
    StiProtectionProcedure procedure = citizenService.getProcedure(principal);
    return StiProtectionProcedureMapper.toCitizenInterfaceType(procedure);
  }

  @PutMapping("/medicalHistory")
  @Operation(summary = "Update or insert medical history once for citizen user.")
  @Transactional
  public void updateCitizenMedicalHistory(
      @AuthenticationPrincipal Jwt principal,
      @Valid @RequestBody CreateMedicalHistoryRequest request) {
    StiProtectionProcedure procedure = citizenService.getProcedure(principal);

    if (Boolean.TRUE.equals(procedure.getMedicalHistorySubmitted())) {
      throw new BadRequestException(
          "The citizen has already submitted the medical history once. Multiple submissions are prohibited.");
    }

    procedure.setMedicalHistorySubmitted(true);

    UUID procedureId = procedure.getExternalId();
    MedicalHistory medicalHistory = medicalHistoryService.getOrCreateMedicalHistory(procedureId);
    MedicalHistoryMapper.update(request.medicalHistory(), medicalHistory);
    progressEntryUtil.addProgressEntry(
        procedure,
        StiProtectionSystemProgressEntryType.CITIZEN_MEDICAL_HISTORY_UPDATED,
        TriggerType.CITIZEN);
  }

  @DeleteMapping("/appointment")
  @Operation(summary = "Cancel current appointment of an STI procedure as citizen.")
  @Transactional
  public void cancelBookedAppointment(@AuthenticationPrincipal Jwt principal) {
    StiProtectionProcedure procedure = citizenService.getProcedure(principal);
    Appointments.assertHasAppointment(procedure);
    appointmentService.cancelAppointment(procedure);
    progressEntryUtil.addProgressEntry(
        procedure, StiProtectionSystemProgressEntryType.APPOINTMENT_CANCELLED, TriggerType.CITIZEN);
  }

  @PutMapping("/appointment")
  @Operation(summary = "Update current appointment of an STI procedure as citizen.")
  @Transactional
  public void updateBookedAppointment(
      @AuthenticationPrincipal Jwt principal,
      @Valid @RequestBody UpdateBookedAppointmentRequest request) {
    StiProtectionProcedure procedure = citizenService.getProcedure(principal);
    AppointmentHistoryEntry openAppointmentHistoryEntry =
        appointmentService.getOpenAppointmentHistoryEntry(procedure);
    AppointmentData updatedAppointmentData =
        AppointmentMapper.toDataType(request, openAppointmentHistoryEntry.getAppointmentType());
    appointmentService.updateCitizenAppointment(procedure, updatedAppointmentData);
    progressEntryUtil.addProgressEntry(
        procedure,
        StiProtectionSystemProgressEntryType.APPOINTMENT_REBOOKED,
        TriggerType.CITIZEN,
        appointmentService.getAppointmentTimeAsString(updatedAppointmentData));
  }

  @PutMapping("/pin")
  @Operation(summary = "Update the pin credential of a citizen user.")
  @Transactional
  public void updatePin(@Valid @RequestBody UpdatePinRequest request) {
    citizenService.updateAnonymousUserPin(request.currentPin(), request.newPin());
  }

  @GetMapping(path = "/anon-ident-document")
  @Operation(summary = "Get an anonymous identification document for an appointment")
  @Transactional(readOnly = true)
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_PDF_VALUE,
              schema = @Schema(format = "binary")))
  public ResponseEntity<byte[]> getCitizenAnonymousIdentificationDocument(
      @AuthenticationPrincipal Jwt principal) {
    StiProtectionProcedure procedure = citizenService.getProcedure(principal);
    Pdf pdf =
        stiProtectionProcedureService.getAnonymousIdentificationDocument(procedure.getExternalId());
    return ResponseEntities.pdfContent(pdf.getFileName(), pdf.getFileContent().getContent());
  }
}
