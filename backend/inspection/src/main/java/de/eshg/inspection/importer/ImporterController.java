/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.lib.xlsximport.util.FileResponseUtil.filename;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.time.Clock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = ImporterController.BASE_URL)
@Tag(name = "Importer")
public class ImporterController {
  public static final String BASE_URL = BaseUrls.Inspection.INSPECTION_IMPORT_CONTROLLER;

  private final ImporterService importerService;
  private final InspectionFeatureToggle featureToggle;
  private final Resource importTemplate;
  private final Clock clock;

  public ImporterController(
      ImporterService inspectionImporterService,
      InspectionFeatureToggle featureToggle,
      @Value("classpath:templates/import/InspectionImportTemplate.xlsx") Resource importTemplate,
      Clock clock) {
    this.importerService = inspectionImporterService;
    this.featureToggle = featureToggle;
    this.importTemplate = importTemplate;
    this.clock = clock;
  }

  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.ALL_VALUE, schema = @Schema(type = "object")))
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Start import processes")
  @Transactional
  public ResponseEntity<MultiValueMap<String, Object>> importProcesses(
      @RequestPart("file") MultipartFile file) throws IOException {
    featureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    ImportResult result = importerService.importProcesses(file);
    return FileResponseUtil.mapImportResultToMultipartResponse(result, filename(clock));
  }

  @GetMapping(
      path = "/templates/inspection-import-template",
      produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX inspection import template")
  public ResponseEntity<Resource> getInspectionImportTemplate() {
    featureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    return FileResponseUtil.getTemplateFileResponse(importTemplate);
  }
}
