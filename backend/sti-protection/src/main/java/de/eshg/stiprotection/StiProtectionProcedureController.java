/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType.FOLLOW_UP_CREATED;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.annotations.ProcedureStatusTransition;
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
import de.eshg.stiprotection.api.UpdateAppointmentRequest;
import de.eshg.stiprotection.api.UpdatePersonDetailsRequest;
import de.eshg.stiprotection.api.VerifyAnonymousUserPinRequest;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.ConcernMapper;
import de.eshg.stiprotection.mapper.PersonMapper;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.CreatedByUserType;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import de.eshg.stiprotection.util.ProgressEntryUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
            ConcernMapper.toDatabaseType(request.concern()), CreatedByUserType.EMPLOYEE);
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
        stiProtectionService.getProcedure(procedureId));
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

    ResultPage<StiProtectionProcedureData> procedures =
        stiProtectionService.getProcedures(sortOptions, paginationOptions, filterOptions);

    return new GetProceduresOverviewResponse(
        procedures.totalPages(),
        procedures.totalElements(),
        procedures.elements().stream().map(StiProtectionProcedureMapper::toOverviewType).toList());
  }

  @PutMapping("/{id}/person")
  @Operation(summary = "Update the person details of an STI procedure.")
  @Transactional
  public void updatePersonDetails(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody UpdatePersonDetailsRequest request) {
    stiProtectionService.updatePersonDetails(procedureId, PersonMapper.toDataType(request));
  }

  @PostMapping("/{id}/appointment")
  @Operation(summary = "Create a new appointment to an STI procedure.")
  @Transactional
  public void createAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody CreateAppointmentRequest request) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    appointmentService.createAppointment(procedure, AppointmentMapper.toDataType(request));
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
        procedureId,
        StiProtectionSystemProgressEntryType.APPOINTMENT_REBOOKED,
        appointmentTimeAsString);
  }

  @PostMapping("/{id}/appointment/cancel")
  @Operation(summary = "Cancel current appointment of an STI procedure.")
  @Transactional
  public void cancelAppointment(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    if (procedure.getAppointment() == null && procedure.getUserDefinedAppointment() == null) {
      throw new BadRequestException(
          "Procedure %s has no outstanding appointment".formatted(procedure.getExternalId()));
    }
    appointmentService.cancelAppointment(procedure);
    progressEntryUtil.addProgressEntry(
        procedureId, StiProtectionSystemProgressEntryType.APPOINTMENT_CANCELLED);
  }

  @PostMapping("/{id}/appointment/finalize")
  @Operation(summary = "Finalize current appointment of an STI procedure.")
  @Transactional
  public void finalizeAppointment(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    if (procedure.getAppointment() == null && procedure.getUserDefinedAppointment() == null) {
      throw new BadRequestException(
          "Procedure %s has no outstanding appointment".formatted(procedure.getExternalId()));
    }
    appointmentService.finalizeAppointment(procedure);
    progressEntryUtil.addProgressEntry(
        procedureId, StiProtectionSystemProgressEntryType.APPOINTMENT_FINALIZED);
  }

  @PutMapping("/{id}/close")
  @Operation(summary = "Close an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public void closeProcedure(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    if (procedure.getAppointment() != null || procedure.getUserDefinedAppointment() != null) {
      appointmentService.cancelAppointment(procedure);
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
    byte[] content = pdf.getFileContent().getContent();
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(pdf.getFileName(), StandardCharsets.UTF_8)
                .build()
                .toString())
        .body(content);
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
      stiProtectionService.closeProcedure(procedure);
      if (procedure.getAppointment() != null || procedure.getUserDefinedAppointment() != null) {
        appointmentService.cancelAppointment(procedure);
      }
    }

    StiProtectionProcedure followUpProcedure =
        stiProtectionService.createProcedure(
            ConcernMapper.toDatabaseType(request.concern()), CreatedByUserType.EMPLOYEE);
    followUpProcedure.setFollowUp(true);
    stiProtectionService.addPerson(
        followUpProcedure, PersonMapper.toDataType(procedure.getPerson()));
    appointmentService.createAppointment(followUpProcedure, AppointmentMapper.toDataType(request));
    String pin = stiProtectionService.generatePin();
    stiProtectionService.registerAnonymousUser(followUpProcedure, pin);

    followUpProcedureService.transferFollowUpData(procedure, followUpProcedure);

    progressEntryUtil.addProgressEntry(followUpProcedure.getExternalId(), FOLLOW_UP_CREATED);
    return new CreateFollowUpProcedureResponse(followUpProcedure.getExternalId(), pin);
  }
}
