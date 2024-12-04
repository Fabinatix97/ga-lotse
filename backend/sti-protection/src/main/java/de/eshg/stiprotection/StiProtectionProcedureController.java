/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.annotations.ProcedureStatusTransition;
import de.eshg.stiprotection.api.CreateAppointmentRequest;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.GetStiProtectionProceduresPaginationOptions;
import de.eshg.stiprotection.api.GetStiProtectionProceduresResponse;
import de.eshg.stiprotection.api.GetStiProtectionProceduresSortOptions;
import de.eshg.stiprotection.api.StiProtectionProcedureDto;
import de.eshg.stiprotection.api.UpdateAppointmentRequest;
import de.eshg.stiprotection.api.UpdatePersonDetailsRequest;
import de.eshg.stiprotection.api.VerifyAnonymousUserPinRequest;
import de.eshg.stiprotection.mapper.AppointmentMapper;
import de.eshg.stiprotection.mapper.StiProtectionProcedureMapper;
import de.eshg.stiprotection.persistence.data.ResultPage;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.lang3.RandomStringUtils;
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

  public StiProtectionProcedureController(
      StiProtectionProcedureService stiProtectionService,
      AppointmentService appointmentService,
      AuditLogger auditLogger) {
    this.stiProtectionService = stiProtectionService;
    this.appointmentService = appointmentService;
    this.auditLogger = auditLogger;
  }

  @PostMapping
  @Transactional
  public CreateProcedureResponse createProcedure(
      @Valid @RequestBody CreateProcedureRequest request) {
    StiProtectionProcedure procedure = stiProtectionService.createProcedure(request);
    String pin = RandomStringUtils.secure().nextNumeric(6);
    stiProtectionService.registerAnonymousUser(procedure, pin);
    return StiProtectionProcedureMapper.toInterfaceType(procedure, pin);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get STI protection procedure by id.")
  @Transactional(readOnly = true)
  public StiProtectionProcedureDto getStiProcedure(@PathVariable("id") UUID procedureId) {
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
  @Operation(summary = "Get sorted and paginated STI procedures.")
  public GetStiProtectionProceduresResponse getStiProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetStiProtectionProceduresPaginationOptions paginationOptions) {

    ResultPage<StiProtectionProcedureData> procedures =
        stiProtectionService.getProcedures(sortOptions, paginationOptions);

    return new GetStiProtectionProceduresResponse(
        procedures.totalPages(),
        procedures.totalElements(),
        procedures.elements().stream().map(StiProtectionProcedureMapper::toOverviewType).toList());
  }

  @PutMapping("/{id}/person")
  @Operation(summary = "Update the person details of an STI procedure.")
  @Transactional
  public StiProtectionProcedureDto updatePersonDetails(
      @PathVariable("id") UUID procedureId,
      @Valid @RequestBody UpdatePersonDetailsRequest request) {
    stiProtectionService.updatePersonDetails(procedureId, request);
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
  }

  @PostMapping("/{id}/appointment")
  @Operation(summary = "Create a new appointment to an STI procedure.")
  @Transactional
  public void createAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody CreateAppointmentRequest request) {
    StiProtectionProcedure procedure = stiProtectionService.findProcedureByExternalId(procedureId);
    appointmentService.createAppointment(procedure, AppointmentMapper.toDataType(request));
  }

  @PutMapping("/{id}/appointment")
  @Operation(summary = "Update current appointment of an STI procedure.")
  @Transactional
  public void updateAppointment(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody UpdateAppointmentRequest request) {
    StiProtectionProcedure procedure = stiProtectionService.findProcedureByExternalId(procedureId);
    appointmentService.updateAppointment(
        procedure, AppointmentMapper.toDataType(request, procedure.getConcern()));
  }

  @PostMapping("/{id}/appointment/cancel")
  @Operation(summary = "Cancel current appointment of an STI procedure.")
  @Transactional
  public void cancelAppointment(@PathVariable("id") UUID procedureId) {
    StiProtectionProcedure procedure = stiProtectionService.findProcedureByExternalId(procedureId);
    appointmentService.cancelAppointment(procedure);
  }

  @PutMapping("/{id}/close")
  @Operation(summary = "Close an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public StiProtectionProcedureDto closeProcedure(@PathVariable("id") UUID procedureId) {
    stiProtectionService.closeProcedure(procedureId);
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
  }

  @PutMapping("/{id}/reopen")
  @Operation(summary = "Re-open an STI procedure.")
  @Transactional
  @ProcedureStatusTransition
  public StiProtectionProcedureDto reopenProcedure(@PathVariable("id") UUID procedureId) {
    stiProtectionService.reopenProcedure(procedureId);
    return StiProtectionProcedureMapper.toInterfaceType(
        stiProtectionService.getProcedure(procedureId));
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
}
