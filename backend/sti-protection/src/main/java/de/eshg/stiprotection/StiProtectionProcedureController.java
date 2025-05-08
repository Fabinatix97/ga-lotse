/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType.APPOINTMENT_ADDED;
import static de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType.FOLLOW_UP_CREATED;
import static de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType.PERSON_DETAILS_UPDATED;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.CreateAppointmentRequest;
import de.eshg.stiprotection.api.CreateFollowUpProcedureRequest;
import de.eshg.stiprotection.api.CreateFollowUpProcedureResponse;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.GetProcedureResponse;
import de.eshg.stiprotection.api.GetProceduresOverviewResponse;
import de.eshg.stiprotection.api.GetStiProtectionProceduresFilterOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.ResponseEntities;
import de.eshg.stiprotection.api.StiProtectionProcedureOverviewDto;
import de.eshg.stiprotection.api.UpdateAppointmentRequest;
import de.eshg.stiprotection.api.UpdatePersonDetailsRequest;
import de.eshg.stiprotection.api.VerifyAnonymousUserPinRequest;
import de.eshg.stiprotection.aspect.ProcedureStatusTransition;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.PersonMapper;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import de.eshg.stiprotection.persistence.Appointments;
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.StiProcedureOrigin;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = StiProtectionProcedureController.BASE_URL)
@Tag(name = "StiProtectionProcedure")
public class StiProtectionProcedureController {

  public static final String BASE_URL = BaseUrls.StiProtection.PROCEDURE_CONTROLLER;

  private final StiProtectionProcedureService stiProtectionService;
  private final AppointmentService appointmentService;
  private final AuditLogger auditLogger;
  private final StiProtectionProcedureFinder procedureFinder;
  private final ProgressEntryUtil progressEntryUtil;
  private final FollowUpProcedureService followUpProcedureService;

  public StiProtectionProcedureController(
      StiProtectionProcedureService stiProtectionService,
      AppointmentService appointmentService,
      AuditLogger auditLogger,
      StiProtectionProcedureFinder procedureFinder,
      ProgressEntryUtil progressEntryUtil,
      FollowUpProcedureService followUpProcedureService) {
    this.stiProtectionService = stiProtectionService;
    this.appointmentService = appointmentService;
    this.auditLogger = auditLogger;
    this.procedureFinder = procedureFinder;
    this.progressEntryUtil = progressEntryUtil;
    this.followUpProcedureService = followUpProcedureService;
  }

  @PostMapping
  @Operation(summary = "Create a new STI procedure.")
  @Transactional
  public CreateProcedureResponse createProcedure(
      @Valid @RequestBody CreateProcedureRequest request) {
    StiProtectionProcedure procedure =
        stiProtectionService.createProcedure(
            ConcernMapper.toDatabaseType(request.concern()),
            ProcedureStatus.OPEN,
            StiProcedureOrigin.EMPLOYEE_PORTAL);
    stiProtectionService.addPerson(procedure, PersonMapper.toDataType(request));
    appointmentService.createAppointment(procedure, AppointmentMapper.toDataType(request));
    String pin = stiProtectionService.generatePin();
    stiProtectionService.registerAnonymousUser(procedure, pin);
    return StiProtectionProcedureMapper.toInterfaceType(procedure, pin);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get STI protection procedure by id.")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public GetProcedureResponse getStiProcedure(@PathVariable("id") UUID procedureId) {
    auditLogger.log(
        "Vorgangsbearbeitung",
        "Abfrage Vorgangs-Details",
        Map.of(
            "ID des Vorgangs",
            procedureId.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.findByExternalId(procedureId));
  }

  @GetMapping
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  @Operation(summary = "Get sorted and paginated STI procedures.")
  public GetProceduresOverviewResponse getStiProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresFilterOptions filterOptions) {

    ResultPage<StiProtectionProcedure> procedures =
        stiProtectionService.getProcedures(sortOptions, paginationOptions, filterOptions);

    return new GetProceduresOverviewResponse(
        procedures.totalPages(),
        procedures.totalElements(),
        procedures.elements().stream().map(StiProtectionProcedureMapper::toOverviewType).toList());
  }

  @GetMapping("/search")
  @Operation(summary = "Find STI procedures by access code or lab sample barcode.")
  @Transactional(readOnly = true)
  public GetProceduresOverviewResponse findProcedures(@RequestParam(value = "text") String text) {
    List<StiProtectionProcedureOverviewDto> procedures =
        stiProtectionService.findProcedures(text).stream()
            .map(StiProtectionProcedureMapper::toOverviewType)
            .toList();
    int totalPages = procedures.isEmpty() ? 0 : 1;
    return new GetProceduresOverviewResponse(totalPages, procedures.size(), procedures);
  }

  @PutMapping("/{id}/person")
  @Operation(summary = "Update the person details of an STI procedure.")
  @Transactional
  public void updatePersonDetails(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody UpdatePersonDetailsRequest request) {
    stiProtectionService.updatePersonDetails(procedureId, PersonMapper.toDataType(request));
    progressEntryUtil.addProgressEntry(procedureId, PERSON_DETAILS_UPDATED, TriggerType.EMPLOYEE);
  }

  @PostMapping("/{id}/appointment")
  @Operation(summary = "Create a new appointment to an STI procedure.")
  @Transactional
  public void createAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody CreateAppointmentRequest request) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    appointmentService.createAppointment(procedure, AppointmentMapper.toDataType(request));
    progressEntryUtil.addProgressEntry(procedureId, APPOINTMENT_ADDED, TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/appointment")
  @Operation(summary = "Update current appointment of an STI procedure.")
  @Transactional
  public void updateAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody UpdateAppointmentRequest request) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    AppointmentHistoryEntry appointmentHistoryEntry =
        appointmentService.getOpenAppointmentHistoryEntry(procedure);
    AppointmentData appointmentData =
        AppointmentMapper.toDataType(request, appointmentHistoryEntry.getAppointmentType());
    appointmentService.updateAppointment(procedure, appointmentData);
    String appointmentTimeAsString = appointmentService.getAppointmentTimeAsString(appointmentData);
    progressEntryUtil.addProgressEntry(
        procedure,
        StiProtectionSystemProgressEntryType.APPOINTMENT_REBOOKED,
        TriggerType.EMPLOYEE,
        appointmentTimeAsString);
  }

  @PostMapping("/{id}/appointment/cancel")
  @Operation(summary = "Cancel current appointment of an STI procedure.")
  @Transactional
  public void cancelAppointment(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    Appointments.assertHasAppointment(procedure);
    appointmentService.cancelAppointmentDeleteCalendarEvent(procedure);
    progressEntryUtil.addProgressEntry(
        procedure,
        StiProtectionSystemProgressEntryType.APPOINTMENT_CANCELLED,
        TriggerType.EMPLOYEE);
  }

  @PostMapping("/{id}/appointment/finalize")
  @Operation(summary = "Finalize current appointment of an STI procedure.")
  @Transactional
  public void finalizeAppointment(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    Appointments.assertHasAppointment(procedure);
    appointmentService.finalizeAppointment(procedure);
    progressEntryUtil.addProgressEntry(
        procedure,
        StiProtectionSystemProgressEntryType.APPOINTMENT_FINALIZED,
        TriggerType.EMPLOYEE);
  }

  @PutMapping("/{id}/close")
  @Operation(summary = "Close an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void closeProcedure(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    if (procedure.getAppointment() != null || procedure.getUserDefinedAppointment() != null) {
      appointmentService.cancelAppointmentDeleteCalendarEvent(procedure);
    }
    stiProtectionService.closeProcedure(procedure);
  }

  @PutMapping("/{id}/reopen")
  @Operation(summary = "Re-open an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void reopenProcedure(@PathVariable("id") UUID procedureId) {
    stiProtectionService.reopenProcedure(procedureId);
  }

  @GetMapping(path = "/{id}/anon-ident-document")
  @Operation(summary = "Get an anonymous identification document")
  @Transactional(readOnly = true)
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_PDF_VALUE,
              schema = @Schema(format = "binary")))
  public ResponseEntity<byte[]> getAnonymousIdentificationDocument(
      @PathVariable("id") UUID procedureId) {
    Pdf pdf = stiProtectionService.getAnonymousIdentificationDocument(procedureId);
    return ResponseEntities.pdfContent(pdf.getFileName(), pdf.getFileContent().getContent());
  }

  @PostMapping("/{id}/verify-pin")
  @Operation(summary = "Verify anonymous user PIN for a given STI procedure.")
  @Transactional(readOnly = true)
  public void verifyAnonymousUserPin(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody VerifyAnonymousUserPinRequest request) {
    String pin = request.pin();
    stiProtectionService.verifyAnonymousUserPin(procedureId, pin);
  }

  @PostMapping("/{id}/follow-up")
  @Operation(summary = "Create an STI follow-up procedure.")
  @Transactional
  @ProcedureStatusTransition
  public CreateFollowUpProcedureResponse createFollowUpProcedure(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody CreateFollowUpProcedureRequest request) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    if (procedure.getProcedureStatus().isOpen()) {
      stiProtectionService.deleteAnonymousUser(procedure);
      stiProtectionService.closeProcedure(procedure);
      if (procedure.getAppointment() != null || procedure.getUserDefinedAppointment() != null) {
        appointmentService.cancelAppointmentDeleteCalendarEvent(procedure);
      }
    }

    StiProtectionProcedure followUpProcedure =
        stiProtectionService.createProcedure(
            ConcernMapper.toDatabaseType(request.concern()),
            ProcedureStatus.OPEN,
            StiProcedureOrigin.EMPLOYEE_PORTAL);
    followUpProcedure.setFollowUp(true);
    stiProtectionService.addPerson(
        followUpProcedure, PersonMapper.toDataType(procedure.getPerson()));
    appointmentService.createAppointment(followUpProcedure, AppointmentMapper.toDataType(request));
    String pin = stiProtectionService.generatePin();
    stiProtectionService.registerAnonymousUser(followUpProcedure, pin);

    followUpProcedureService.transferFollowUpData(procedure, followUpProcedure);

    progressEntryUtil.addProgressEntry(followUpProcedure, FOLLOW_UP_CREATED, TriggerType.EMPLOYEE);
    return new CreateFollowUpProcedureResponse(followUpProcedure.getExternalId(), pin);
  }
}
