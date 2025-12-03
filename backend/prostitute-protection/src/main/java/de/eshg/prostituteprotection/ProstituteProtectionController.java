/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.prostituteprotection.api.AbortProcedureRequest;
import de.eshg.prostituteprotection.api.CloseProcedureRequest;
import de.eshg.prostituteprotection.api.ConsultationDto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.GetProstituteProtectionProceduresResponse;
import de.eshg.prostituteprotection.api.ProcedureDetailsDto;
import de.eshg.prostituteprotection.api.ProcedureProperty;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.RequiredProcedureArea;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.ValidateRequiredProcedureDataResponse;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.ConsultationType;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.prostituteprotection.pdf.ConsultationCertificateGenerator;
import de.eshg.prostituteprotection.pdf.PrintDocumentType;
import de.eshg.prostituteprotection.pdf.RegistrationConsultationCertificateGenerator;
import de.eshg.prostituteprotection.util.ProgressEntryUtil;
import de.eshg.prostituteprotection.util.ProstituteProtectionProgressEntryType;
import de.eshg.prostituteprotection.util.TaskUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.EnumSet;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProstituteProtectionController.BASE_URL)
@Tag(name = "ProstituteProtection")
public class ProstituteProtectionController {
  public static final String BASE_URL = BaseUrls.ProstituteProtection.PROCEDURE_CONTROLLER;

  private final ProstituteProtectionService prostituteProtectionService;
  private final ProstituteProtectionAppointmentService prostituteProtectionAppointmentService;
  private final ProgressEntryUtil progressEntryUtil;
  private final ConsultationCertificateGenerator consultationCertificateGenerator;
  private final RegistrationConsultationCertificateGenerator
      registrationConsultationCertificateGenerator;
  private final Clock clock;

  public ProstituteProtectionController(
      ProstituteProtectionService prostituteProtectionService,
      ProstituteProtectionAppointmentService prostituteProtectionAppointmentService,
      ProgressEntryUtil progressEntryUtil,
      ConsultationCertificateGenerator consultationCertificateGenerator,
      RegistrationConsultationCertificateGenerator registrationConsultationCertificateGenerator,
      Clock clock) {
    this.prostituteProtectionService = prostituteProtectionService;
    this.prostituteProtectionAppointmentService = prostituteProtectionAppointmentService;
    this.progressEntryUtil = progressEntryUtil;
    this.consultationCertificateGenerator = consultationCertificateGenerator;
    this.registrationConsultationCertificateGenerator =
        registrationConsultationCertificateGenerator;
    this.clock = clock;
  }

  @PostMapping
  @Operation(summary = "Create a new prostitute-protection procedure.")
  @Transactional
  public CreateProstituteProtectionProcedureResponse createProcedure(
      @Valid @RequestBody CreateProstituteProtectionProcedureRequest request) {
    return prostituteProtectionService.createProcedure(request);
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Get prostitute protection procedures. Sort and page the results.")
  public GetProstituteProtectionProceduresResponse getProcedures(
      @InlineParameterObject @ParameterObject @Valid
          ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters) {
    Page<ProstituteProtectionProcedure> pagedProcedures =
        prostituteProtectionService.getProcedures(paginationAndSortParameters);
    return new GetProstituteProtectionProceduresResponse(
        pagedProcedures.stream()
            .map(ProstituteProtectionMapper::mapProcedureToOverviewDto)
            .toList(),
        pagedProcedures.getTotalElements());
  }

  @GetMapping("/{procedureId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns procedure details identified by UUID")
  public ProcedureDetailsDto getProcedure(@PathVariable("procedureId") UUID procedureId) {
    return ProstituteProtectionMapper.mapToDetailsDto(
        prostituteProtectionService.findByExternalIdOrThrow(procedureId));
  }

  @PatchMapping("/{procedureId}")
  @Transactional
  @Operation(summary = "Update the prostitute protection procedure and appointment")
  public ProcedureDetailsDto updateProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody UpdateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdForUpdate(procedureId, request.version());
    prostituteProtectionService.updateProcedure(procedure, request);
    prostituteProtectionAppointmentService.bookAppointment(
        procedure, AppointmentMapper.toDataType(request));

    progressEntryUtil.addSystemProgressEntry(
        procedure, ProstituteProtectionProgressEntryType.PROCEDURE_DETAILS_MODIFIED);

    return getProcedure(procedureId);
  }

  @PatchMapping("/{procedureId}/personal-data")
  @Transactional
  @Operation(summary = "Update the personal data inside procedure")
  public ProcedureDetailsDto updateProcedurePersonalData(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody UpdateEncryptedPersonalDataRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdForUpdate(procedureId, request.version());
    prostituteProtectionService.updateEncryptedPersonalDataInProcedure(procedure, request);

    progressEntryUtil.addSystemProgressEntry(
        procedure, ProstituteProtectionProgressEntryType.PERSON_DETAILS_MODIFIED);

    return getProcedure(procedureId);
  }

  @GetMapping("/{procedureId}/consultation")
  @Transactional(readOnly = true)
  @Operation(summary = "Get consultation for a procedure.")
  public ConsultationDto getConsultation(@PathVariable("procedureId") UUID procedureId) {
    Consultation consultation = prostituteProtectionService.findConsultation(procedureId);

    return ProstituteProtectionMapper.mapConsultationToDto(consultation);
  }

  @PutMapping("/{procedureId}/consultation")
  @Transactional
  @Operation(summary = "Update consultation for a procedure.")
  public ConsultationDto updateConsultation(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody ConsultationDto request) {
    Consultation consultation =
        prostituteProtectionService.findConsultationForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(consultation.getProcedure());
    Consultation requestedConsultation =
        ProstituteProtectionMapper.mapConsultationToDomain(request);
    ProstituteProtectionValidator.validateConsultation(requestedConsultation);
    prostituteProtectionService.updateConsultation(consultation, requestedConsultation);

    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);
    progressEntryUtil.addSystemProgressEntry(
        procedure, ProstituteProtectionProgressEntryType.CONSULTATION_MODIFIED);

    return ProstituteProtectionMapper.mapConsultationToDto(consultation);
  }

  @GetMapping("/{procedureId}/validate-completeness")
  @Transactional(readOnly = true)
  public ValidateRequiredProcedureDataResponse validateCompleteness(
      @PathVariable("procedureId") UUID procedureId) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);

    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas =
        ProstituteProtectionValidator.validateCompleteness(procedure);

    return new ValidateRequiredProcedureDataResponse(incompleteAreas);
  }

  @PostMapping("/{procedureId}/consultation-certificate-print")
  @Transactional
  public ResponseEntity<Resource> generateConsultationCertificatePdf(
      @PathVariable("procedureId") UUID procedureId) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);
    validateForPdfGeneration(procedure);

    Pdf pdf = consultationCertificateGenerator.generateConsultationCertificate(procedure);
    progressEntryUtil.addSystemProgressEntry(
        procedure,
        ProstituteProtectionProgressEntryType.CONSULTATION_CERTIFICATE_GENERATED,
        getCertificateCreatedDescription(procedure.getConsultationType()),
        pdf,
        PrintDocumentType.CONSULTATION_CERTIFICATE);
    procedure.setConsultationCertificateCreatedAt(Instant.now(clock));

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(pdf.getFileName(), StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
        .body(new ByteArrayResource(pdf.getFileContent().getContent()));
  }

  private static void validateForPdfGeneration(ProstituteProtectionProcedure procedure) {
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> map =
        ProstituteProtectionValidator.validateCompleteness(procedure);
    if (!map.isEmpty()) {
      throw new BadRequestException(
          "Procedure %s is not complete.".formatted(procedure.getExternalId()));
    }
  }

  @PostMapping("/{procedureId}/registration-consultation-certificate-print")
  @Transactional
  public ResponseEntity<Resource> generateRegistrationConsultationCertificatePdf(
      @PathVariable("procedureId") UUID procedureId) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);
    validateForPdfGeneration(procedure);

    Pdf pdf =
        registrationConsultationCertificateGenerator.generateRegistrationConsultationCertificate(
            procedure);
    progressEntryUtil.addSystemProgressEntry(
        procedure,
        ProstituteProtectionProgressEntryType.REGISTRATION_CONSULTATION_CERTIFICATE_GENERATED,
        getCertificateCreatedDescription(procedure.getConsultationType()),
        pdf,
        PrintDocumentType.REGISTRATION_CONSULTATION_CERTIFICATE);

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(pdf.getFileName(), StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
        .body(new ByteArrayResource(pdf.getFileContent().getContent()));
  }

  private String getCertificateCreatedDescription(ConsultationType consultationType) {
    return switch (consultationType) {
      case null -> null;
      case INITIAL -> "Das Zertifikat wurde für die Erstberatung erstellt.";
      case FOLLOW_UP -> "Das Zertifikat wurde für die Folgeberatung erstellt.";
    };
  }

  @PostMapping("/{procedureId}/close-procedure")
  @Transactional
  public ProcedureDetailsDto closeProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CloseProcedureRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdForUpdate(procedureId, request.version());
    ProstituteProtectionValidator.validateConsultationCertificateCreated(procedure);
    prostituteProtectionService.closeProcedure(procedure);
    TaskUtil.closeSingleTaskOfType(procedure, TaskType.PROSTITUTE_PROTECTION);
    return ProstituteProtectionMapper.mapToDetailsDto(procedure);
  }

  @PostMapping("/{procedureId}/abort-procedure")
  @Transactional
  public ProcedureDetailsDto abortProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody AbortProcedureRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdForUpdate(procedureId, request.version());
    prostituteProtectionService.abortProcedure(procedure);
    TaskUtil.closeSingleTaskOfType(procedure, TaskType.PROSTITUTE_PROTECTION);
    return ProstituteProtectionMapper.mapToDetailsDto(procedure);
  }
}
