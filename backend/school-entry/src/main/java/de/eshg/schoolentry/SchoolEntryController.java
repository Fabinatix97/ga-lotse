/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.MEDICAL_REPORT_GENERATED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.SCHOOL_INFO_LETTER_GENERATED;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.AnamnesisDto;
import de.eshg.schoolentry.api.schoolinfoletter.SaveSchoolInfoLetterRequest;
import de.eshg.schoolentry.business.model.PagedProcedures;
import de.eshg.schoolentry.business.model.PagedWaitingRoomProcedures;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.mapper.*;
import de.eshg.schoolentry.mapper.SchoolInfoLetterExaminationMapper;
import de.eshg.schoolentry.pdf.SchoolInfoLetterGenerator;
import de.eshg.schoolentry.pdf.medicalreport.MedicalReportGenerator;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.SchoolEntryKeyDocumentType;
import de.eshg.schoolentry.util.TaskUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(SchoolEntryController.BASE_URL)
@Tag(name = "SchoolEntry")
public class SchoolEntryController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER;

  private final SchoolEntryService schoolEntryService;
  private final ProcedureOverviewService procedureOverviewService;
  private final ExaminationResultService examinationResultService;
  private final MeasuringDeviceService measuringDeviceService;
  private final PersonService personService;
  private final SchoolEntryProcedureDeletionService procedureDeletionService;
  private final MedicalReportGenerator medicalReportGenerator;
  private final SchoolInfoLetterGenerator schoolInfoLetterGenerator;
  private final SchoolInfoLetterService schoolInfoLetterService;
  private final Validator validator;
  private final Clock clock;
  private final AppointmentBlockConfig appointmentBlockConfig;
  private final ProgressEntryUtil progressEntryUtil;
  private final AuditLogger auditLogger;
  private final SchoolEntryFeatureToggle schoolEntryFeatureToggle;

  public SchoolEntryController(
      SchoolEntryService schoolEntryService,
      ProcedureOverviewService procedureOverviewService,
      ExaminationResultService examinationResultService,
      MeasuringDeviceService measuringDeviceService,
      PersonService personService,
      SchoolEntryProcedureDeletionService procedureDeletionService,
      MedicalReportGenerator medicalReportGenerator,
      SchoolInfoLetterGenerator schoolInfoLetterGenerator,
      SchoolInfoLetterService schoolInfoLetterService,
      Validator validator,
      Clock clock,
      AppointmentBlockConfig appointmentBlockConfig,
      ProgressEntryUtil progressEntryUtil,
      AuditLogger auditLogger,
      SchoolEntryFeatureToggle schoolEntryFeatureToggle) {
    this.schoolEntryService = schoolEntryService;
    this.procedureOverviewService = procedureOverviewService;
    this.examinationResultService = examinationResultService;
    this.measuringDeviceService = measuringDeviceService;
    this.personService = personService;
    this.procedureDeletionService = procedureDeletionService;
    this.medicalReportGenerator = medicalReportGenerator;
    this.schoolInfoLetterGenerator = schoolInfoLetterGenerator;
    this.schoolInfoLetterService = schoolInfoLetterService;
    this.validator = validator;
    this.clock = clock;
    this.appointmentBlockConfig = appointmentBlockConfig;
    this.progressEntryUtil = progressEntryUtil;
    this.auditLogger = auditLogger;
    this.schoolEntryFeatureToggle = schoolEntryFeatureToggle;
  }

  @PostMapping
  @Transactional
  @Operation(summary = "Create a school entry procedure.")
  public CreateProcedureResponse createProcedure(
      @Valid @RequestBody CreateProcedureRequest request) {

    SchoolEntryProcedure schoolEntryProcedure = schoolEntryService.createProcedure(request);

    return new CreateProcedureResponse(schoolEntryProcedure.getExternalId());
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(
      summary =
          "Get all school entry procedures. Filter results by type. Sort and page the results by id.")
  public GetProceduresResponse getProcedures(
      @InlineParameterObject @ParameterObject @Valid ProcedureFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProcedurePaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters,
      @InlineParameterObject @ParameterObject @Valid
          HumanReadablePersonIdSearchParameters humanReadablePersonId) {

    Validator.validateOnlyOneOfSearchAndFilterParametersAndHumanReadableIdAreSet(
        filterParameters, searchParameters, humanReadablePersonId);
    Validator.validateFiltersConsistent(filterParameters);
    PagedProcedures pagedProcedures =
        procedureOverviewService.getProcedures(
            filterParameters, paginationAndSortParameters, searchParameters, humanReadablePersonId);
    return new GetProceduresResponse(
        pagedProcedures.stream().map(ProcedureMapper::mapProcedureToDto).toList(),
        pagedProcedures.totalNumberOfProcedures());
  }

  @GetMapping("/{procedureId}")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  @Operation(summary = "Get school entry procedure by id.")
  public ProcedureDetailsDto getProcedure(@PathVariable("procedureId") UUID procedureId) {
    ProcedureDetailsData procedureDetailsData =
        schoolEntryService.findAndAugmentProcedureByExternalId(procedureId);
    auditLogger.log(
        "Vorgangsbearbeitung",
        "Abfrage Vorgangs-Details",
        Map.of(
            "ID des Vorgangs",
            procedureId.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));
    return ProcedureMapper.mapProcedureToDetailsDto(procedureDetailsData);
  }

  @GetMapping("/by-person-id")
  @Transactional(readOnly = true)
  public GetProceduresWithDetailsResponse getProceduresByPersonQuery(
      @RequestParam(name = "personId") UUID personId) {
    List<ProcedureDetailsDto> procedures =
        schoolEntryService
            .findByPersonId(personId)
            .map(ProcedureMapper::mapProcedureToDetailsDto)
            .toList();
    return new GetProceduresWithDetailsResponse(procedures);
  }

  @PutMapping("/{procedureId}")
  @Transactional
  public ProcedureDetailsDto updateProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody UpdateProcedureRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);

    SchoolEntryProcedure updatedProcedure = schoolEntryService.updateProcedure(procedure, request);

    return augmentAndMap(updatedProcedure);
  }

  private ProcedureDetailsDto augmentAndMap(SchoolEntryProcedure procedure) {
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);
    return ProcedureMapper.mapProcedureToDetailsDto(procedureDetailsData);
  }

  @PatchMapping("/bulk-procedure-label")
  @Transactional
  public UpdateProceduresBulkResponse updateProceduresWithLabels(
      @Valid @RequestBody UpdateProceduresWithLabelsRequest request) {
    return schoolEntryService.updateProceduresWithLabels(
        request.procedureIdsAndVersion(), request.procedureLabels());
  }

  @PatchMapping("/bulk-procedure-invitation-sent")
  @Transactional
  public UpdateProceduresBulkResponse updateProceduresInvitationSent(
      @Valid @RequestBody UpdateProceduresInvitationSentRequest request) {
    return schoolEntryService.updateProceduresInvitationSent(request.procedureIdsAndVersion());
  }

  @PostMapping("/{procedureId}/close-procedure")
  @Transactional
  public ProcedureDetailsDto closeProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CloseProcedureRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(procedureId, request.version());
    Validator.validateSchoolInfoLetterCreated(procedure);

    schoolEntryService.closeProcedure(procedure);
    return augmentAndMap(procedure);
  }

  @PostMapping("/{procedureId}/reopen-procedure")
  @Transactional
  public ProcedureDetailsDto reopenProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody ReopenProcedureRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.reopenProcedure(procedureId, request.version());
    return augmentAndMap(procedure);
  }

  @PutMapping("/{procedureId}/child")
  @Transactional
  public ProcedureDetailsDto updateChildData(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody UpdatePersonRequest request) {
    Person child = personService.findChildForUpdate(procedureId, request.version());
    SchoolEntryProcedure procedure = child.getProcedure();
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);

    personService.updateChildData(procedure, child, request);
    return augmentAndMap(procedure);
  }

  @DeleteMapping("/{procedureId}/delete-procedure")
  @Transactional
  public void deleteProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DeleteProcedureRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(procedureId, request.version());
    Validator.validateDeletionOfProcedure(schoolEntryService.augmentWithDetails(procedure));

    procedureDeletionService.deleteAndWriteToCemetery(procedure);
  }

  @PutMapping("/{procedureId}/sync-person")
  @Transactional
  public ProcedureDetailsDto syncPersonData(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SyncPersonRequest request) {
    Person person =
        personService.findPersonForUpdate(
            procedureId, request.fileStateId(), request.personVersion());
    SchoolEntryProcedure procedure = person.getProcedure();
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);

    SchoolEntryProcedure updatedProcedure =
        personService.syncPersonData(procedure, person, request);
    return augmentAndMap(updatedProcedure);
  }

  @PutMapping("/{procedureId}/custodian")
  @Transactional
  public ProcedureDetailsDto addCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody AddCustodianRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(
            procedureId, request.procedureVersion());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    personService.addCustodianToProcedure(procedure, request.custodian());
    return augmentAndMap(procedure);
  }

  @PutMapping("/{procedureId}/custodian-without-dob")
  @Transactional
  public ProcedureDetailsDto addCustodianWithoutDateOfBirth(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody AddCustodianWithoutDateOfBirthRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(
            procedureId, request.procedureVersion());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    personService.addCustodianToProcedure(procedure, request.custodian());
    return augmentAndMap(procedure);
  }

  @PutMapping("/{procedureId}/custodian/{custodianCentralFileStateId}")
  @Transactional
  public ProcedureDetailsDto updateCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianCentralFileStateId") UUID custodianCentralFileStateId,
      @Valid @RequestBody UpdatePersonRequest request) {
    Person custodian =
        personService.findPersonForUpdate(
            procedureId, custodianCentralFileStateId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(custodian.getProcedure());
    personService.updateCustodian(request, custodianCentralFileStateId, custodian);
    return augmentAndMap(custodian.getProcedure());
  }

  @PutMapping("/{procedureId}/custodian-without-dob/{custodianId}")
  @Transactional
  public ProcedureDetailsDto updateCustodianWithoutDateOfBirth(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianId") UUID custodianId,
      @Valid @RequestBody UpdatePersonWithoutDateOfBirthRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    personService.updateCustodianWithoutDateOfBirth(procedure, custodianId, request);
    return augmentAndMap(procedure);
  }

  @DeleteMapping("/{procedureId}/custodian/{custodianCentralFileStateId}")
  @Transactional
  public ProcedureDetailsDto removeCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianCentralFileStateId") UUID custodianCentralFileStateId,
      @Valid @RequestBody RemoveCustodianRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(
            procedureId, request.procedureVersion());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    personService.removeCustodian(custodianCentralFileStateId, procedure);
    return augmentAndMap(procedure);
  }

  @DeleteMapping("/{procedureId}/custodian-without-dob/{custodianId}")
  @Transactional
  public ProcedureDetailsDto removeCustodianWithoutDateOfBirth(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianId") UUID custodianId,
      @Valid @RequestBody RemoveCustodianRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(
            procedureId, request.procedureVersion());
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    personService.removeCustodianWithoutDateOfBirth(custodianId, procedure);
    return augmentAndMap(procedure);
  }

  @GetMapping("/{procedureId}/free-appointments")
  @Transactional(readOnly = true)
  @Operation(
      summary =
          "Get free appointments for a procedure. Free appointments are determined based on the ProcedureType and labels.")
  public GetFreeAppointmentsResponse getFreeAppointmentsForProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @RequestParam(name = "procedureType", required = false) ProcedureTypeDto procedureType,
      @RequestParam(name = "labelIds", required = false) List<UUID> labelIds,
      @RequestParam(name = "schoolId", required = false) UUID schoolId,
      @RequestParam(name = "locationId", required = false) UUID locationId) {
    List<AppointmentDto> availableAppointmentsForProcedure =
        schoolEntryService.getFreeAppointmentsForProcedure(
            procedureId,
            ProcedureMapper.mapToDomain(procedureType),
            labelIds,
            schoolId,
            locationId);
    return new GetFreeAppointmentsResponse(availableAppointmentsForProcedure);
  }

  @PostMapping("/appointments")
  @Transactional
  public CreateAppointmentsBulkResponse createAppointmentsInBulk(
      @Valid @RequestBody CreateAppointmentsBulkRequest request) {
    return schoolEntryService.createAppointmentsInBulk(request).mapToResponse();
  }

  @GetMapping("/{procedureId}/hearing-test-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get hearing test for a procedure.")
  public HearingTestResultDto getHearingTestResult(@PathVariable("procedureId") UUID procedureId) {
    HearingTestResult hearingTestResult =
        examinationResultService.findHearingTestResult(procedureId);
    return ExaminationResultMapper.mapToDto(hearingTestResult);
  }

  @PutMapping("/{procedureId}/hearing-test-result")
  @Transactional
  @Operation(summary = "Update hearing test for a procedure.")
  public HearingTestResultDto updateHearingTestResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody HearingTestResultDto request) {
    HearingTestResult hearingTestResult =
        examinationResultService.findHearingTestResultForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(hearingTestResult.getProcedure());
    Validator.validateUpdateHearingTestResult(request);

    examinationResultService.updateHearingTestResult(
        hearingTestResult, ExaminationResultMapper.mapToDomain(request));
    schoolEntryService.updateFirstEyeExaminationOrHearingTestModifiedBy(procedureId);

    return ExaminationResultMapper.mapToDto(hearingTestResult);
  }

  @PostMapping("/{procedureId}/hearing-test-initiate")
  @Transactional
  @Operation(summary = "Initiate hearing test on a measuring device for a procedure.")
  public HearingTestInitializationResponse initiateHearingTest(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody HearingTestInitializationRequest request) {
    validateMeasuringDevicesFeatureToggleEnabled();
    ProcedureDetailsData procedureDetailsData =
        schoolEntryService.findAndAugmentProcedureByExternalId(procedureId);
    PersonDetailsData child = procedureDetailsData.child();

    PendingMeasurement pendingMeasurement =
        measuringDeviceService.initiateHearingTest(procedureId, request.equipmentSelector(), child);

    examinationResultService.startHearingTestOnADevice(
        procedureId, pendingMeasurement, request.version());

    return ExaminationResultMapper.mapToResponse(pendingMeasurement);
  }

  @PostMapping("/{procedureId}/hearing-test-complete")
  @Transactional
  @Operation(
      summary =
          "Fetch hearing test results from measuring device, update and complete the test for a procedure.")
  public HearingTestResultDto completeHearingTest(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody HearingTestCompleteRequest request) {
    validateMeasuringDevicesFeatureToggleEnabled();

    HearingTestResult hearingTestResult =
        examinationResultService.findHearingTestResultForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(hearingTestResult.getProcedure());
    Validator.validateMeasurementIsPending(hearingTestResult);

    HearingTestResult hearingTestResultFromMeasuringDevice =
        measuringDeviceService.completeHearingTest(hearingTestResult);

    examinationResultService.updateHearingTestResult(
        hearingTestResult, hearingTestResultFromMeasuringDevice);
    schoolEntryService.updateFirstEyeExaminationOrHearingTestModifiedBy(procedureId);

    return ExaminationResultMapper.mapToDto(hearingTestResult);
  }

  @GetMapping("/{procedureId}/eye-examination-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get eye examination for a procedure.")
  public EyeExaminationResultDto getEyeExaminationResult(
      @PathVariable("procedureId") UUID procedureId) {
    EyeExaminationResult eyeExaminationResult =
        examinationResultService.findEyeExaminationResult(procedureId);
    return ExaminationResultMapper.mapToDto(eyeExaminationResult);
  }

  @PutMapping("/{procedureId}/eye-examination-result")
  @Transactional
  @Operation(summary = "Update eye examination for a procedure.")
  public EyeExaminationResultDto updateEyeExaminationResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody EyeExaminationResultDto request) {
    EyeExaminationResult eyeExaminationResult =
        examinationResultService.findEyeExaminationResultForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(eyeExaminationResult.getProcedure());
    Validator.validateUpdateEyeExaminationResult(request);

    examinationResultService.updateEyeExaminationResult(
        eyeExaminationResult, ExaminationResultMapper.mapToDomain(request));
    schoolEntryService.updateFirstEyeExaminationOrHearingTestModifiedBy(procedureId);

    return ExaminationResultMapper.mapToDto(eyeExaminationResult);
  }

  @GetMapping("/{procedureId}/sopess-examination-result")
  @Transactional(readOnly = true)
  public SopessExaminationResultDto getSopessExaminationResult(
      @PathVariable("procedureId") UUID procedureId) {
    SopessExaminationResult sopessExaminationResult =
        examinationResultService.findSopessExaminationResult(procedureId);
    return ExaminationResultMapper.mapToDto(sopessExaminationResult);
  }

  @PutMapping("/{procedureId}/sopess-examination-result")
  @Transactional
  public SopessExaminationResultDto updateSopessExaminationResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SopessExaminationResultDto request) {
    SopessExaminationResult sopessExaminationResult =
        examinationResultService.findSopessExaminationResultForUpdate(
            procedureId, request.getVersion());
    ProcedureValidator.validateProcedureStatusNotClosed(sopessExaminationResult.getProcedure());
    validator.validateUpdateSopessExaminationResult(request);

    examinationResultService.updateSopessExaminationResult(
        sopessExaminationResult, ExaminationResultMapper.mapToDomain(request));

    return ExaminationResultMapper.mapToDto(sopessExaminationResult);
  }

  @GetMapping("/{procedureId}/development-screening-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get development screening result for a procedure.")
  public GetDevelopmentScreeningResultDto getDevelopmentScreeningResult(
      @PathVariable("procedureId") UUID procedureId) {
    DevelopmentScreening developmentScreeningResult =
        examinationResultService.findDevelopmentScreeningResult(procedureId);
    Map<String, String> icd10CodeToOriginalCode =
        examinationResultService.resolveIcd10Codes(developmentScreeningResult);

    return ExaminationResultMapper.mapToDto(developmentScreeningResult, icd10CodeToOriginalCode);
  }

  @PutMapping("/{procedureId}/development-screening-result")
  @Transactional
  @Operation(summary = "Update development screening result for a procedure.")
  public GetDevelopmentScreeningResultDto updateDevelopmentScreeningResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DevelopmentScreeningResultDto request) {
    DevelopmentScreening developmentScreeningResult =
        examinationResultService.findDevelopmentScreeningResultForUpdate(
            procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(developmentScreeningResult.getProcedure());
    validator.validateUpdateDevelopmentScreeningResult(request);

    examinationResultService.updateDevelopmentScreeningResult(
        developmentScreeningResult, ExaminationResultMapper.mapToDomain(request));

    Map<String, String> icd10CodeToOriginalCode =
        examinationResultService.resolveIcd10Codes(developmentScreeningResult);
    return ExaminationResultMapper.mapToDto(developmentScreeningResult, icd10CodeToOriginalCode);
  }

  @GetMapping("/{procedureId}/vaccination-status")
  @Transactional(readOnly = true)
  @Operation(summary = "Get vaccination status for a procedure.")
  public VaccinationStatusDto getVaccinationStatus(@PathVariable("procedureId") UUID procedureId) {
    VaccinationStatus vaccinationStatus =
        examinationResultService.findVaccinationStatus(procedureId);
    return VaccinationStatusMapper.mapToDto(vaccinationStatus);
  }

  @PutMapping("/{procedureId}/vaccination-status")
  @Transactional
  @Operation(summary = "Update vaccination status for a procedure.")
  public VaccinationStatusDto updateVaccinationStatus(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody VaccinationStatusDto request) {
    VaccinationStatus vaccinationStatus =
        examinationResultService.findVaccinationStatusForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(vaccinationStatus.getProcedure());

    examinationResultService.updateVaccinationStatus(
        vaccinationStatus, VaccinationStatusMapper.mapToDomain(request));

    return VaccinationStatusMapper.mapToDto(vaccinationStatus);
  }

  @GetMapping("/{procedureId}/anamnesis")
  @Transactional(readOnly = true)
  @Operation(summary = "Get anamnesis for a procedure.")
  public AnamnesisDto getAnamnesis(@PathVariable("procedureId") UUID procedureId) {
    Anamnesis anamnesis = examinationResultService.findAnamnesis(procedureId);
    return AnamnesisMapper.mapToDto(anamnesis);
  }

  @PutMapping("/{procedureId}/anamnesis")
  @Transactional
  @Operation(summary = "Update anamnesis for a procedure.")
  public AnamnesisDto updateAnamnesis(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody AnamnesisDto request) {
    Anamnesis anamnesis =
        examinationResultService.findAnamnesisForUpdate(procedureId, request.version());
    ProcedureValidator.validateProcedureStatusNotClosed(anamnesis.getProcedure());
    validator.validateAnamnesis(request);

    examinationResultService.updateAnamnesis(anamnesis, AnamnesisMapper.mapToDomain(request));

    return AnamnesisMapper.mapToDto(anamnesis);
  }

  @PostMapping("/{procedureId}/medical-report")
  @Transactional
  public ResponseEntity<Resource> createMedicalReport(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateMedicalReportRequest request) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);

    Pdf pdf = medicalReportGenerator.generateMedicalReport(procedureDetailsData.child(), request);
    progressEntryUtil.addProgressEntry(procedure, MEDICAL_REPORT_GENERATED, pdf);

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

  @GetMapping("/{procedureId}/school-info-letter")
  @Transactional(readOnly = true)
  public GetSchoolInfoLetterResponse getSchoolInfoLetter(
      @PathVariable("procedureId") UUID procedureId) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    validateCompletenessForSchoolInfoLetter(procedure);
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);
    return new GetSchoolInfoLetterResponse(
        schoolInfoLetterService.determineDefaultSchoolInfoLetterExamination(
            procedure, procedureDetailsData),
        schoolInfoLetterService.getSchoolInfoLetterExamination(procedure, procedureDetailsData));
  }

  private static void validateCompletenessForSchoolInfoLetter(SchoolEntryProcedure procedure) {
    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas =
        SchoolInfoLetterValidator.validateSchoolEntryProcedure(procedure);
    if (!incompleteAreas.isEmpty()) {
      throw new BadRequestException(
          "School entry procedure is not complete.",
          "Incomplete areas: %s".formatted(incompleteAreas));
    }
  }

  @PostMapping("/{procedureId}/school-info-letter")
  @Transactional
  public void saveSchoolInfoLetter(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SaveSchoolInfoLetterRequest request) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);

    procedure.setSchoolInfoLetter(SchoolInfoLetterExaminationMapper.mapToPersistence(request));
  }

  @PostMapping("/{procedureId}/school-info-letter-print")
  @Transactional
  public ResponseEntity<Resource> generateSchoolInfoLetterPdf(
      @PathVariable("procedureId") UUID procedureId) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    validateForGeneration(procedure);
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);

    Pdf pdf = schoolInfoLetterGenerator.generateSchoolInfoLetter(procedure, procedureDetailsData);
    progressEntryUtil.addProgressEntry(
        procedure,
        SCHOOL_INFO_LETTER_GENERATED,
        pdf,
        SchoolEntryKeyDocumentType.SCHOOL_INFO_LETTER);
    procedure.setSchoolInfoLetterCreatedAt(Instant.now(clock));
    TaskUtil.closeOptionalTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);
    schoolEntryService.updateFirstSchoolInfoLetterGeneratedBy(procedure);

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

  private static void validateForGeneration(SchoolEntryProcedure procedure) {
    if (procedure.getSchoolInfoLetter() == null) {
      throw new BadRequestException("No school info letter found");
    }
    if (!SchoolInfoLetterValidator.validateDetails(procedure).isEmpty()) {
      throw new BadRequestException("Procedure details are incomplete.");
    }
  }

  @PutMapping("/{procedureId}/waiting-room")
  @Transactional
  @Operation(summary = "Update waiting room details for a procedure.")
  public WaitingRoomDto updateWaitingRoomDetails(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody WaitingRoomDto request) {
    assertLocationModeNotSet();
    WaitingRoom waitingRoom =
        schoolEntryService.findWaitingRoomForUpdate(procedureId, request.version());
    SchoolEntryProcedure procedure = waitingRoom.getProcedure();
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    Validator.validateHasAppointment(procedure);

    schoolEntryService.updateWaitingRoomDetails(
        procedure.getWaitingRoom(), WaitingRoomMapper.mapToDomain(request));
    return WaitingRoomMapper.mapToDto(waitingRoom);
  }

  @GetMapping("/{procedureId}/validate-completeness")
  @Transactional(readOnly = true)
  public ValidateRequiredProcedureDataResponse validateCompleteness(
      @PathVariable("procedureId") UUID procedureId) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);

    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas =
        SchoolInfoLetterValidator.validateSchoolEntryProcedure(procedure);

    return new ValidateRequiredProcedureDataResponse(incompleteAreas);
  }

  @GetMapping("/waiting-room-procedures")
  @Transactional(readOnly = true)
  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @InlineParameterObject @ParameterObject @Valid
          WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    assertLocationModeNotSet();

    PagedWaitingRoomProcedures pagedProcedures =
        procedureOverviewService.getWaitingRoomProcedures(paginationAndSortParameters);
    return new GetWaitingRoomProceduresResponse(
        pagedProcedures.stream().map(WaitingRoomMapper::mapWaitingRoomProcedureToDto).toList(),
        pagedProcedures.totalNumberOfProcedures());
  }

  @PostMapping("/download/invitations")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadInvitations(
      @Valid @RequestBody DownloadInvitationsBulkRequest request) throws IOException {
    String timeStamp =
        clock
            .instant()
            .atZone(clock.getZone())
            .format(DateTimeFormatter.ofPattern("yyyy_MM_dd_HH_mm"));
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename("Einladungen_%s.zip".formatted(timeStamp), StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.ZIP_VALUE)
        .body(
            new ByteArrayResource(
                schoolEntryService.zipInvitationsForProcedures(request.procedureIds())));
  }

  private void assertLocationModeNotSet() {
    if (appointmentBlockConfig.getLocationSelectionMode() != LocationSelectionMode.NONE) {
      throw ExceptionUtil.badRequestExceptionUnsupportedLocationMode();
    }
  }

  @GetMapping("/employee-self-statistics")
  @Transactional(readOnly = true)
  @Operation(summary = "Get examinations performed in the given time range by current user")
  public GetEmployeeSelfStatisticsResponse getEmployeeSelfStatistics(
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd) {
    return schoolEntryService.getEmployeeStatistics(
        CurrentUserHelper.getCurrentUserId(), timeRangeStart, timeRangeEnd);
  }

  private void validateMeasuringDevicesFeatureToggleEnabled() {
    if (!schoolEntryFeatureToggle.isNewFeatureEnabled(SchoolEntryFeature.MEASURING_DEVICES)) {
      throw new BadRequestException("Feature toggle for examination on devices is not enabled!");
    }
  }
}
