/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.prostituteprotection.api.AbortProcedureRequest;
import de.eshg.prostituteprotection.api.CloseProcedureRequest;
import de.eshg.prostituteprotection.api.ConsultationDto;
import de.eshg.prostituteprotection.api.CreateCertificateRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.DownloadCertificateRequest;
import de.eshg.prostituteprotection.api.GetCertificatesResponse;
import de.eshg.prostituteprotection.api.GetProstituteProtectionPersonSearchResponse;
import de.eshg.prostituteprotection.api.GetProstituteProtectionProceduresResponse;
import de.eshg.prostituteprotection.api.ProcedureDetailsDto;
import de.eshg.prostituteprotection.api.ProcedureProperty;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePersonSearchParameters;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchOverviewDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureSearchParameters;
import de.eshg.prostituteprotection.api.RequiredProcedureArea;
import de.eshg.prostituteprotection.api.UpdateEncryptedPersonalDataRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.ValidateRequiredProcedureDataResponse;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.data.ProstituteProtectionProcedureWithAugmentedData;
import de.eshg.prostituteprotection.domain.model.CertificateType;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.ConsultationType;
import de.eshg.prostituteprotection.domain.model.EncryptedFile;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.prostituteprotection.pdf.ConsultationCertificateGenerator;
import de.eshg.prostituteprotection.pdf.PrintDocumentType;
import de.eshg.prostituteprotection.pdf.RegistrationConsultationCertificateGenerator;
import de.eshg.prostituteprotection.util.ProgressEntryUtil;
import de.eshg.prostituteprotection.util.ProstituteProtectionProgressEntryType;
import de.eshg.prostituteprotection.util.TaskUtil;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProstituteProtectionController.BASE_URL)
@Tag(name = "ProstituteProtection")
public class ProstituteProtectionController {
  public static final String BASE_URL = BaseUrls.ProstituteProtection.PROCEDURE_CONTROLLER;
  public static final String CONSULTATION_CERTIFICATE_KEY = "consultationCertificate";
  public static final String REGISTRATION_CERTIFICATE_KEY = "registrationCertificate";

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
    ProstituteProtectionValidator.validateAlias(request.alias(), request.appointmentBookingType());
    return prostituteProtectionService.createProcedure(request);
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Get prostitute protection procedures. Sort and page the results.")
  public GetProstituteProtectionProceduresResponse getProcedures(
      @InlineParameterObject @ParameterObject @Valid
          ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProstituteProtectionProcedureSearchParameters searchParameters) {
    Page<ProstituteProtectionProcedure> pagedProcedures =
        prostituteProtectionService.getProcedures(paginationAndSortParameters, searchParameters);
    return new GetProstituteProtectionProceduresResponse(
        pagedProcedures.stream()
            .map(ProstituteProtectionMapper::mapProcedureToOverviewDto)
            .toList(),
        pagedProcedures.getTotalElements());
  }

  @PostMapping("/person-search")
  @Transactional(readOnly = true)
  @Operation(summary = "Search for procedures with firstName, lastName and dateOfBirth.")
  public GetProstituteProtectionPersonSearchResponse personSearch(
      @InlineParameterObject @ParameterObject @Valid
          ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters,
      @RequestBody @Valid ProstituteProtectionProcedurePersonSearchParameters searchParameters) {
    Page<ProstituteProtectionProcedureSearchOverviewDto> procedureSearchOverviewDtoList =
        prostituteProtectionService.searchProcedures(paginationAndSortParameters, searchParameters);
    return new GetProstituteProtectionPersonSearchResponse(
        procedureSearchOverviewDtoList.getContent(),
        procedureSearchOverviewDtoList.getTotalElements());
  }

  @GetMapping("/{procedureId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns procedure details identified by UUID")
  public ProcedureDetailsDto getProcedure(@PathVariable("procedureId") UUID procedureId) {
    ProstituteProtectionProcedureWithAugmentedData procedureWithAugmentedData =
        prostituteProtectionService.findAndAugment(procedureId);
    return ProstituteProtectionMapper.mapToDetailsDto(procedureWithAugmentedData);
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
        procedure, AppointmentMapper.toDataType(request), request.consultantId());

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
      @PathVariable("procedureId") UUID procedureId,
      @RequestParam("withAlias") boolean withAlias,
      @RequestParam("withRegistrationCertificate") boolean withRegistrationCertificate) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);

    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas =
        ProstituteProtectionValidator.validateCompleteness(
            procedure, withAlias, withRegistrationCertificate);

    return new ValidateRequiredProcedureDataResponse(incompleteAreas);
  }

  @PostMapping("/{procedureId}/consultation-certificate-print")
  @Transactional
  public ResponseEntity<MultiValueMap<String, Object>> generateConsultationCertificatePdf(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateCertificateRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdOrThrow(procedureId);
    DecryptedPersonalDataDto decryptedPersonalDataDto =
        prostituteProtectionService.decryptPersonalData(procedure, request);

    ProstituteProtectionValidator.validateForPdfGeneration(
        procedure,
        decryptedPersonalDataDto,
        request.withAlias(),
        request.withRegistrationCertificate());

    prostituteProtectionService.updateAgeAtConsultation(procedure, decryptedPersonalDataDto);

    MultiValueMap<String, Object> multipart = new LinkedMultiValueMap<>();

    ByteArrayResource consultationCertificate =
        consultationCertificateGenerator.generateConsultationCertificate(
            procedure, decryptedPersonalDataDto, request.withAlias());

    prostituteProtectionService.encryptAndSaveFile(
        procedure, request, consultationCertificate.getByteArray(), false);

    progressEntryUtil.addSystemProgressEntry(
        procedure,
        ProstituteProtectionProgressEntryType.CONSULTATION_CERTIFICATE_GENERATED,
        getCertificateCreatedDescription(procedure.getConsultationType()));
    procedure.setConsultationCertificateCreatedAt(Instant.now(clock));
    multipart.add(CONSULTATION_CERTIFICATE_KEY, consultationCertificate);

    if (request.withRegistrationCertificate()) {
      ByteArrayResource registrationCertificate =
          registrationConsultationCertificateGenerator.generateRegistrationConsultationCertificate(
              procedure, decryptedPersonalDataDto, request.withAlias());

      prostituteProtectionService.encryptAndSaveFile(
          procedure, request, registrationCertificate.getByteArray(), true);
      progressEntryUtil.addSystemProgressEntry(
          procedure,
          ProstituteProtectionProgressEntryType.REGISTRATION_CONSULTATION_CERTIFICATE_GENERATED,
          getCertificateCreatedDescription(procedure.getConsultationType()));

      multipart.add(REGISTRATION_CERTIFICATE_KEY, registrationCertificate);
    }

    if (request.withAlias()) {
      prostituteProtectionService.setCertificateWithAliasCreated(procedure);
    }
    return ResponseEntity.ok().contentType(MediaType.MULTIPART_FORM_DATA).body(multipart);
  }

  private String getCertificateCreatedDescription(ConsultationType consultationType) {
    return switch (consultationType) {
      case null -> null;
      case INITIAL -> "Das Zertifikat wurde für die Erstberatung erstellt.";
      case FOLLOW_UP -> "Das Zertifikat wurde für die Folgeberatung erstellt.";
    };
  }

  @PostMapping("/{procedureId}/certificate")
  @Transactional(readOnly = true)
  @Operation(summary = "Decrypt and download a previously generated consultation certificate")
  public ResponseEntity<ByteArrayResource> downloadCertificate(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DownloadCertificateRequest request) {

    EncryptedFile encryptedFile =
        prostituteProtectionService.findEncryptedFileOrThrow(procedureId, request.id());

    byte[] decryptedFile = prostituteProtectionService.decryptFile(encryptedFile, request);

    ByteArrayResource resource = new ByteArrayResource(decryptedFile);

    String filename =
        String.format(
            "%s_%s.pdf",
            (encryptedFile.getCertificateType() == CertificateType.SECTION_7)
                ? PrintDocumentType.REGISTRATION_CONSULTATION_CERTIFICATE.getFileNamePrefix()
                : PrintDocumentType.CONSULTATION_CERTIFICATE.getFileNamePrefix(),
            ZonedDateTime.ofInstant(encryptedFile.getCreatedAt(), ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss", Locale.GERMANY)));

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
        .body(resource);
  }

  @GetMapping("/{procedureId}/certificates")
  @Transactional(readOnly = true)
  @Operation(summary = "Get a list of certificates for a procedure.")
  public GetCertificatesResponse getCertificates(@PathVariable("procedureId") UUID procedureId) {
    return new GetCertificatesResponse(
        prostituteProtectionService.getEncryptedFilesForProcedure(procedureId));
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
    return ProstituteProtectionMapper.mapToDetailsDto(
        prostituteProtectionService.augmentWithDetails(procedure));
  }

  @PostMapping("/{procedureId}/abort-procedure")
  @Transactional
  public ProcedureDetailsDto abortProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody AbortProcedureRequest request) {
    ProstituteProtectionProcedure procedure =
        prostituteProtectionService.findByExternalIdForUpdate(procedureId, request.version());
    prostituteProtectionService.abortProcedureAndFlush(procedure);
    TaskUtil.closeSingleTaskOfType(procedure, TaskType.PROSTITUTE_PROTECTION);
    return ProstituteProtectionMapper.mapToDetailsDto(
        prostituteProtectionService.augmentWithDetails(procedure));
  }
}
