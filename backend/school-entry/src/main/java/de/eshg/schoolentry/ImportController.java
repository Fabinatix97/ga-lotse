/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.config.SchoolEntryFeature;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.importer.ImportService;
import de.eshg.schoolentry.importer.ImportType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import java.io.IOException;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(ImportController.BASE_URL)
@Tag(name = "Import")
public class ImportController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.IMPORT_CONTROLLER;
  private static final DateTimeFormatter FILE_TIMESTAMP =
      DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

  private final ImportService importService;
  private final Resource citizenListTemplate;
  private final Resource schoolListTemplate;
  private final Resource pastProcedureListTemplate;
  private final SchoolEntryProperties schoolEntryProperties;
  private final Validator validator;
  private final Clock clock;
  private final SchoolEntryFeatureToggle featureToggle;

  public ImportController(
      ImportService importService,
      @Value("classpath:templates/import/CitizenListTemplate.xlsx") Resource citizenListTemplate,
      @Value("classpath:templates/import/SchoolListTemplate.xlsx") Resource schoolListTemplate,
      @Value("classpath:templates/import/PastProcedureListTemplate.xlsx")
          Resource pastProcedureListTemplate,
      SchoolEntryProperties schoolEntryProperties,
      Validator validator,
      Clock clock,
      SchoolEntryFeatureToggle featureToggle) {
    this.importService = importService;
    this.citizenListTemplate = citizenListTemplate;
    this.schoolListTemplate = schoolListTemplate;
    this.pastProcedureListTemplate = pastProcedureListTemplate;
    this.schoolEntryProperties = schoolEntryProperties;
    this.validator = validator;
    this.clock = clock;
    this.featureToggle = featureToggle;
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

    ImportResult result =
        importService.importProceduresFromFile(
            file, ImportType.CITIZEN_LIST, null, null, Year.of(schoolYear));

    return FileResponseUtil.mapImportResultToMultipartResponse(result, filename());
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

    ImportResult result =
        importService.importProceduresFromFile(
            file, ImportType.SCHOOL_LIST, schoolId, locationId, Year.of(schoolYear));

    return FileResponseUtil.mapImportResultToMultipartResponse(result, filename());
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

    ImportResult result =
        importService.importProceduresFromFile(
            file, ImportType.PAST_PROCEDURE_LIST, schoolId, null, Year.of(schoolYear));

    return FileResponseUtil.mapImportResultToMultipartResponse(result, filename());
  }

  private String filename() {
    return "ImportResult_%s.xlsx".formatted(LocalDateTime.now(clock).format(FILE_TIMESTAMP));
  }

  @GetMapping(path = "/templates/citizen-list", produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX citizen list template.")
  public ResponseEntity<Resource> getCitizenListTemplate() {
    return FileResponseUtil.getTemplateFileResponse(citizenListTemplate);
  }

  @GetMapping(path = "/templates/school-list", produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX school list template.")
  public ResponseEntity<Resource> getSchoolListTemplate() {
    return FileResponseUtil.getTemplateFileResponse(schoolListTemplate);
  }

  @GetMapping(
      path = "/templates/past-procedure-list",
      produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX past procedures list template.")
  public ResponseEntity<Resource> getPastProcedureListTemplate() {
    featureToggle.assertNewFeatureIsEnabled(SchoolEntryFeature.IMPORT_PAST_PROCEDURES);
    return FileResponseUtil.getTemplateFileResponse(pastProcedureListTemplate);
  }
}
