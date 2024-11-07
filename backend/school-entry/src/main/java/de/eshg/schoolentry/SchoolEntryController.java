/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.lib.xlsximport.ImportValidator.validateFileExistsAndHasCorrectType;
import static de.eshg.lib.xlsximport.ImportValidator.validateHeaderExists;
import static de.eshg.lib.xlsximport.ImportValidator.validateSheet;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.MEDICAL_REPORT_GENERATED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.SCHOOL_INFO_LETTER_GENERATED;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.AnamnesisDto;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.config.SchoolEntryFeature;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.importer.ImportService;
import de.eshg.schoolentry.importer.ImportType;
import de.eshg.schoolentry.mapper.*;
import de.eshg.schoolentry.pdf.medicalreport.MedicalReportGenerator;
import de.eshg.schoolentry.pdf.schoolinfoletter.SchoolInfoLetterGenerator;
import de.eshg.schoolentry.pdf.schoolinfoletter.SchoolInfoLetterValidator;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.TaskUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(SchoolEntryController.BASE_URL)
@Tag(name = "SchoolEntry")
public class SchoolEntryController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER;
  private static final DateTimeFormatter FILE_TIMESTAMP =
      DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

  private final SchoolEntryService schoolEntryService;
  private final ImportService importService;
  private final MedicalReportGenerator medicalReportGenerator;
  private final SchoolInfoLetterGenerator schoolInfoLetterGenerator;
  private final Validator validator;
  private final Resource citizenListTemplate;
  private final Resource schoolListTemplate;
  private final Clock clock;
  private final SchoolEntryFeatureToggle featureToggle;
  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryProperties schoolEntryProperties;
  private final ProgressEntryUtil progressEntryUtil;

  public SchoolEntryController(
      SchoolEntryService schoolEntryService,
      ImportService importService,
      MedicalReportGenerator medicalReportGenerator,
      SchoolInfoLetterGenerator schoolInfoLetterGenerator,
      Validator validator,
      Clock clock,
      @Value("classpath:templates/import/CitizenListTemplate.xlsx") Resource citizenListTemplate,
      @Value("classpath:templates/import/SchoolListTemplate.xlsx") Resource schoolListTemplate,
      SchoolEntryFeatureToggle featureToggle,
      AppointmentBlockProperties appointmentBlockProperties,
      SchoolEntryProperties schoolEntryProperties,
      ProgressEntryUtil progressEntryUtil) {
    this.schoolEntryService = schoolEntryService;
    this.importService = importService;
    this.medicalReportGenerator = medicalReportGenerator;
    this.schoolInfoLetterGenerator = schoolInfoLetterGenerator;
    this.validator = validator;
    this.citizenListTemplate = citizenListTemplate;
    this.schoolListTemplate = schoolListTemplate;
    this.clock = clock;
    this.featureToggle = featureToggle;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryProperties = schoolEntryProperties;
    this.progressEntryUtil = progressEntryUtil;
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
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters) {

    Validator.validateOnlyOneOfSearchAndFilterParametersAreSet(filterParameters, searchParameters);
    Validator.validateSearchParametersAreComplete(searchParameters);
    PagedProcedures pagedProcedures =
        schoolEntryService.getProcedures(
            filterParameters, paginationAndSortParameters, searchParameters);
    return new GetProceduresResponse(
        pagedProcedures.stream().map(ProcedureMapper::mapProcedureToDto).toList(),
        pagedProcedures.totalNumberOfProcedures());
  }

  @GetMapping("/{procedureId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Get school entry procedure by id.")
  public ProcedureDetailsDto getProcedure(@PathVariable("procedureId") UUID procedureId) {
    ProcedureDetailsData procedureDetailsData =
        schoolEntryService.findAndAugmentProcedureByExternalId(procedureId);
    return ProcedureMapper.mapProcedureToDetailsDto(procedureDetailsData);
  }

  @PutMapping("/{procedureId}")
  @Transactional
  public ProcedureDetailsDto updateProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody UpdateProcedureRequest request) {
    SchoolEntryProcedure procedure =
        schoolEntryService.findProcedureByExternalIdForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(procedure);

    SchoolEntryProcedure updatedProcedure = schoolEntryService.updateProcedure(procedure, request);

    return augmentAndMap(updatedProcedure);
  }

  private ProcedureDetailsDto augmentAndMap(SchoolEntryProcedure procedure) {
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);
    return ProcedureMapper.mapProcedureToDetailsDto(procedureDetailsData);
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
    Person child = schoolEntryService.findChildForUpdate(procedureId, request.version());
    SchoolEntryProcedure procedure = child.getProcedure();
    Validator.validateProcedureStatusNotClosed(procedure);

    schoolEntryService.updateChildData(procedure, child, request);
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

    schoolEntryService.deleteProcedure(procedure);
  }

  @PutMapping("/{procedureId}/sync-person")
  @Transactional
  public ProcedureDetailsDto syncPersonData(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SyncPersonRequest request) {
    Person person =
        schoolEntryService.findPersonForUpdate(
            procedureId, request.fileStateId(), request.personVersion());
    SchoolEntryProcedure procedure = person.getProcedure();
    Validator.validateProcedureStatusNotClosed(procedure);

    SchoolEntryProcedure updatedProcedure =
        schoolEntryService.syncPersonData(procedure, person, request);
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
    Validator.validateProcedureStatusNotClosed(procedure);
    schoolEntryService.addCustodianToProcedure(procedure, request.custodian());
    return augmentAndMap(procedure);
  }

  @PutMapping("/{procedureId}/custodian/{custodianCentralFileStateId}")
  @Transactional
  public ProcedureDetailsDto updateCustodian(
      @PathVariable("procedureId") UUID procedureId,
      @PathVariable("custodianCentralFileStateId") UUID custodianCentralFileStateId,
      @Valid @RequestBody UpdatePersonRequest request) {
    Person custodian =
        schoolEntryService.findPersonForUpdate(
            procedureId, custodianCentralFileStateId, request.version());
    Validator.validateProcedureStatusNotClosed(custodian.getProcedure());
    schoolEntryService.updateCustodian(request, custodianCentralFileStateId, custodian);
    return augmentAndMap(custodian.getProcedure());
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
    Validator.validateProcedureStatusNotClosed(procedure);
    schoolEntryService.removeCustodian(custodianCentralFileStateId, procedure);
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
      @RequestParam(name = "locationId", required = false) UUID locationId) {
    List<AppointmentDto> availableAppointmentsForProcedure =
        schoolEntryService.getFreeAppointmentsForProcedure(
            procedureId, ProcedureMapper.mapToDomain(procedureType), labelIds, locationId);
    return new GetFreeAppointmentsResponse(availableAppointmentsForProcedure);
  }

  @PostMapping("/appointments")
  @Transactional
  public CreateAppointmentsBulkResponse createAppointmentsInBulk(
      @Valid @RequestBody CreateAppointmentsBulkRequest request) {
    return schoolEntryService.createAppointmentsInBulk(request.procedureIds()).mapToResponse();
  }

  @GetMapping("/{procedureId}/hearing-test-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get hearing test for a procedure.")
  public HearingTestResultDto getHearingTestResult(@PathVariable("procedureId") UUID procedureId) {
    HearingTestResult hearingTestResult = schoolEntryService.findHearingTestResult(procedureId);
    return ExaminationResultMapper.mapToDto(hearingTestResult);
  }

  @PutMapping("/{procedureId}/hearing-test-result")
  @Transactional
  @Operation(summary = "Update hearing test for a procedure.")
  public HearingTestResultDto updateHearingTestResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody HearingTestResultDto request) {
    HearingTestResult hearingTestResult =
        schoolEntryService.findHearingTestResultForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(hearingTestResult.getProcedure());
    Validator.validateUpdateHearingTestResult(request);

    schoolEntryService.updateHearingTestResult(
        hearingTestResult, ExaminationResultMapper.mapToDomain(request));

    return ExaminationResultMapper.mapToDto(hearingTestResult);
  }

  @GetMapping("/{procedureId}/eye-examination-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get eye examination for a procedure.")
  public EyeExaminationResultDto getEyeExaminationResult(
      @PathVariable("procedureId") UUID procedureId) {
    EyeExaminationResult eyeExaminationResult =
        schoolEntryService.findEyeExaminationResult(procedureId);
    return ExaminationResultMapper.mapToDto(eyeExaminationResult);
  }

  @PutMapping("/{procedureId}/eye-examination-result")
  @Transactional
  @Operation(summary = "Update eye examination for a procedure.")
  public EyeExaminationResultDto updateEyeExaminationResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody EyeExaminationResultDto request) {
    EyeExaminationResult eyeExaminationResult =
        schoolEntryService.findEyeExaminationResultForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(eyeExaminationResult.getProcedure());
    Validator.validateUpdateEyeExaminationResult(request);

    schoolEntryService.updateEyeExaminationResult(
        eyeExaminationResult, ExaminationResultMapper.mapToDomain(request));

    return ExaminationResultMapper.mapToDto(eyeExaminationResult);
  }

  @GetMapping("/{procedureId}/sopess-examination-result")
  @Transactional(readOnly = true)
  public SopessExaminationResultDto getSopessExaminationResult(
      @PathVariable("procedureId") UUID procedureId) {
    SopessExaminationResult sopessExaminationResult =
        schoolEntryService.findSopessExaminationResult(procedureId);
    return ExaminationResultMapper.mapToDto(sopessExaminationResult);
  }

  @PutMapping("/{procedureId}/sopess-examination-result")
  @Transactional
  public SopessExaminationResultDto updateSopessExaminationResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody SopessExaminationResultDto request) {
    SopessExaminationResult sopessExaminationResult =
        schoolEntryService.findSopessExaminationResultForUpdate(procedureId, request.getVersion());
    Validator.validateProcedureStatusNotClosed(sopessExaminationResult.getProcedure());
    Validator.validateUpdateSopessExaminationResult(request);

    schoolEntryService.updateSopessExaminationResult(
        sopessExaminationResult, ExaminationResultMapper.mapToDomain(request));

    return ExaminationResultMapper.mapToDto(sopessExaminationResult);
  }

  @GetMapping("/{procedureId}/development-screening-result")
  @Transactional(readOnly = true)
  @Operation(summary = "Get development screening result for a procedure.")
  public GetDevelopmentScreeningResultDto getDevelopmentScreeningResult(
      @PathVariable("procedureId") UUID procedureId) {
    DevelopmentScreening developmentScreeningResult =
        schoolEntryService.findDevelopmentScreeningResult(procedureId);

    return ExaminationResultMapper.mapToDto(developmentScreeningResult);
  }

  @PutMapping("/{procedureId}/development-screening-result")
  @Transactional
  @Operation(summary = "Update development screening result for a procedure.")
  public GetDevelopmentScreeningResultDto updateDevelopmentScreeningResult(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DevelopmentScreeningResultDto request) {
    DevelopmentScreening developmentScreeningResult =
        schoolEntryService.findDevelopmentScreeningResultForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(developmentScreeningResult.getProcedure());
    validator.validateUpdateDevelopmentScreeningResult(request);

    schoolEntryService.updateDevelopmentScreeningResult(
        developmentScreeningResult, ExaminationResultMapper.mapToDomain(request));

    return ExaminationResultMapper.mapToDto(developmentScreeningResult);
  }

  @GetMapping("/icd10-codes")
  @Transactional(readOnly = true)
  @Operation(summary = "Search in the ICD-10 catalogue.")
  public SearchIcd10CodesResponse searchIcd10Codes(
      @RequestParam(name = "searchString", required = false, defaultValue = "")
          @Schema(
              description =
                  "Search for a string within the ICD-10 codes, groups and their title. The search supports a fuzzy search mechanism.")
          String searchString,
      @RequestParam(name = "codes", required = false, defaultValue = "") List<String> codes) {
    Validator.validateIcd10CodeRequestParams(searchString, codes);
    List<Icd10CodeDto> icd10Codes =
        schoolEntryService
            .searchIcd10Codes(searchString, codes)
            .map(Icd10CodeMapper::mapToDto)
            .toList();
    return new SearchIcd10CodesResponse(icd10Codes);
  }

  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.ALL_VALUE, schema = @Schema(type = "object")))
  @PostMapping(path = "/citizen-list", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @TransactionalWithTimeoutForFileImports
  @Operation(summary = "Upload a XLSX file to create multiple procedures.")
  public ResponseEntity<MultiValueMap<String, Object>> importCitizenList(
      @RequestParam(value = "schoolYear") @Min(1900) int schoolYear,
      @RequestPart("file") MultipartFile file)
      throws IOException {
    if (schoolEntryProperties.isDirectProcedureTypeAssignmentOnImport()) {
      throw new BadRequestException(
          "Citizen list import is not allowed when direct procedure type assignment is enabled.");
    }
    return importData(file, ImportType.CITIZEN_LIST, null, null, Year.of(schoolYear));
  }

  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.ALL_VALUE, schema = @Schema(type = "object")))
  @PostMapping(path = "/school-list/{schoolId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @TransactionalWithTimeoutForFileImports
  @Operation(summary = "Upload a XLSX file to create multiple procedures.")
  public ResponseEntity<MultiValueMap<String, Object>> importSchoolList(
      @PathVariable("schoolId") UUID schoolId,
      @RequestParam(value = "locationId", required = false) UUID locationId,
      @RequestParam(value = "schoolYear") @Min(1900) int schoolYear,
      @RequestPart("file") MultipartFile file)
      throws IOException {
    validator.validateSchoolExists(schoolId);
    validator.validateLocationIdForImport(locationId);
    return importData(file, ImportType.SCHOOL_LIST, schoolId, locationId, Year.of(schoolYear));
  }

  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.ALL_VALUE, schema = @Schema(type = "object")))
  @PostMapping(
      path = "/past-procedure-list/{schoolId}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @TransactionalWithTimeoutForFileImports
  @Operation(summary = "Upload a XLSX file to create multiple past procedures.")
  public ResponseEntity<MultiValueMap<String, Object>> importPastProcedureList(
      @PathVariable("schoolId") UUID schoolId,
      @RequestParam(value = "schoolYear") @Min(1900) int schoolYear,
      @RequestPart("file") MultipartFile file)
      throws IOException {
    featureToggle.assertNewFeatureIsEnabled(SchoolEntryFeature.IMPORT_PAST_PROCEDURES);
    validator.validateSchoolExists(schoolId);
    return importData(file, ImportType.PAST_PROCEDURE_LIST, schoolId, null, Year.of(schoolYear));
  }

  private ResponseEntity<MultiValueMap<String, Object>> importData(
      MultipartFile file, ImportType importType, UUID schoolId, UUID locationId, Year schoolYear)
      throws IOException {
    validateFileExistsAndHasCorrectType(file);

    validator.validateSchoolYear(schoolYear);

    try (InputStream inputStream = file.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      validateSheet(workbook);

      Sheet sheet = workbook.getSheetAt(0);

      validator.validateNumberOfRows(sheet);
      validateHeaderExists(sheet);

      ImportResult result =
          importService.processSheetAndPersistProcedures(
              sheet, importType, schoolId, locationId, schoolYear);

      return FileResponseUtil.mapImportResultToMultipartResponse(result, filename());
    }
  }

  private String filename() {
    return "ImportResult_%s.xlsx".formatted(LocalDateTime.now(clock).format(FILE_TIMESTAMP));
  }

  @GetMapping(
      path = "/templates/citizen-list-template",
      produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX citizen list template.")
  public ResponseEntity<Resource> getCitizenListTemplate() {
    return FileResponseUtil.getTemplateFileResponse(citizenListTemplate);
  }

  @GetMapping(
      path = "/templates/school-list-template",
      produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX school list template.")
  public ResponseEntity<Resource> getSchoolListTemplate() {
    return FileResponseUtil.getTemplateFileResponse(schoolListTemplate);
  }

  @GetMapping("/{procedureId}/vaccination-status")
  @Transactional(readOnly = true)
  @Operation(summary = "Get vaccination status for a procedure.")
  public VaccinationStatusDto getVaccinationStatus(@PathVariable("procedureId") UUID procedureId) {
    VaccinationStatus vaccinationStatus = schoolEntryService.findVaccinationStatus(procedureId);
    return VaccinationStatusMapper.mapToDto(vaccinationStatus);
  }

  @PutMapping("/{procedureId}/vaccination-status")
  @Transactional
  @Operation(summary = "Update vaccination status for a procedure.")
  public VaccinationStatusDto updateVaccinationStatus(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody VaccinationStatusDto request) {
    VaccinationStatus vaccinationStatus =
        schoolEntryService.findVaccinationStatusForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(vaccinationStatus.getProcedure());

    schoolEntryService.updateVaccinationStatus(
        vaccinationStatus, VaccinationStatusMapper.mapToDomain(request));

    return VaccinationStatusMapper.mapToDto(vaccinationStatus);
  }

  @GetMapping("/{procedureId}/anamnesis")
  @Transactional(readOnly = true)
  @Operation(summary = "Get anamnesis for a procedure.")
  public AnamnesisDto getAnamnesis(@PathVariable("procedureId") UUID procedureId) {
    Anamnesis anamnesis = schoolEntryService.findAnamnesis(procedureId);
    return AnamnesisMapper.mapToDto(anamnesis);
  }

  @PutMapping("/{procedureId}/anamnesis")
  @Transactional
  @Operation(summary = "Update anamnesis for a procedure.")
  public AnamnesisDto updateAnamnesis(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody AnamnesisDto request) {
    Anamnesis anamnesis = schoolEntryService.findAnamnesisForUpdate(procedureId, request.version());
    Validator.validateProcedureStatusNotClosed(anamnesis.getProcedure());
    validator.validateAnamnesis(request);

    schoolEntryService.updateAnamnesis(anamnesis, AnamnesisMapper.mapToDomain(request));

    return AnamnesisMapper.mapToDto(anamnesis);
  }

  @PostMapping("/{procedureId}/medical-report")
  @Transactional
  public ResponseEntity<Resource> createMedicalReport(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateMedicalReportRequest request) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    Validator.validateProcedureStatusNotClosed(procedure);
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

  @PostMapping("/{procedureId}/school-info-letter")
  @Transactional
  public ResponseEntity<Resource> createSchoolInfoLetter(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody CreateSchoolInfoLetterRequest request) {

    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    Validator.validateProcedureStatusNotClosed(procedure);
    ProcedureDetailsData procedureDetailsData = schoolEntryService.augmentWithDetails(procedure);

    Pdf pdf =
        schoolInfoLetterGenerator.generateSchoolInfoLetter(
            procedure, procedureDetailsData, request);
    progressEntryUtil.addProgressEntry(procedure, SCHOOL_INFO_LETTER_GENERATED, pdf);
    procedure.setschoolInfoLetterCreatedAt(Instant.now(clock));
    TaskUtil.closeOptionalTaskOfType(procedure, TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION);

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

  @PutMapping("/{procedureId}/waiting-room")
  @Transactional
  @Operation(summary = "Update waiting room details for a procedure.")
  public WaitingRoomDto updateWaitingRoomDetails(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody WaitingRoomDto request) {
    assertLocationModeNotSet();
    WaitingRoom waitingRoom =
        schoolEntryService.findWaitingRoomForUpdate(procedureId, request.version());
    SchoolEntryProcedure procedure = waitingRoom.getProcedure();
    Validator.validateProcedureStatusNotClosed(procedure);
    Validator.validateHasAppointment(procedure);

    schoolEntryService.updateWaitingRoomDetails(
        procedure.getWaitingRoom(), WaitingRoomMapper.mapToDomain(request));
    return WaitingRoomMapper.mapToDto(waitingRoom);
  }

  @GetMapping("/{procedureId}/validate-completeness")
  @Transactional(readOnly = true)
  public ResponseEntity<ValidateRequiredProcedureDataResponse> validateCompleteness(
      @PathVariable("procedureId") UUID procedureId) {
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);

    Map<RequiredProcedureData, Boolean> validationResult =
        SchoolInfoLetterValidator.validateSchoolEntryProcedure(procedure);

    List<RequiredProcedureData> incompleteAreas =
        validationResult.entrySet().stream()
            .filter(entry -> !entry.getValue())
            .map(Map.Entry::getKey)
            .sorted()
            .toList();

    return ResponseEntity.ok(new ValidateRequiredProcedureDataResponse(incompleteAreas));
  }

  @GetMapping("/waiting-room-procedures")
  @Transactional(readOnly = true)
  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @InlineParameterObject @ParameterObject @Valid
          WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    assertLocationModeNotSet();

    PagedWaitingRoomProcedures pagedProcedures =
        schoolEntryService.getWaitingRoomProcedures(paginationAndSortParameters);
    return new GetWaitingRoomProceduresResponse(
        pagedProcedures.stream().map(WaitingRoomMapper::mapWaitingRoomProcedureToDto).toList(),
        pagedProcedures.totalNumberOfProcedures());
  }

  @PostMapping("/download/invitations")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadInvitations(
      @Valid @RequestBody DownloadInvitationsBulkRequest request) throws IOException {
    featureToggle.assertNewFeatureIsEnabled(SchoolEntryFeature.BULK_DOWNLOAD_INVITATIONS);
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename("Einladungen.zip", StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.ZIP_VALUE)
        .body(
            new ByteArrayResource(
                schoolEntryService.zipInvitationsForProcedures(request.procedureIds())));
  }

  private void assertLocationModeNotSet() {
    if (appointmentBlockProperties.getLocationSelectionMode() != LocationSelectionMode.NONE) {
      throw ExceptionUtil.badRequestExceptionUnsupportedLocationMode();
    }
  }
}
