/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.lib.xlsximport.util.FileResponseUtil.filename;
import static de.eshg.lib.xlsximport.util.FileResponseUtil.getTemplateFileResponse;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.xlsximport.XlsxImport;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import de.eshg.medicalregistry.importer.MedicalRegistryColumn;
import de.eshg.medicalregistry.importer.MedicalRegistryImporter;
import de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.ValidatorFactory;
import java.io.IOException;
import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
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
@RequestMapping(MedicalRegistry.MEDICAL_REGISTRY_IMPORT_CONTROLLER)
@Tag(name = "MedicalRegistryImport")
public class MedicalRegistryImportController {

  private static final Logger log = LoggerFactory.getLogger(MedicalRegistryImportController.class);

  public static final String TEMPLATE_FILE_NAME_SERVER = "MedicalRegistryImportTemplate.xlsx";

  public static final String TEMPLATE_FILE_NAME_DOWNLOAD = "Template.xlsx";

  private static final int IMPORTER_BATCH_SIZE = 1000;

  private final MedicalRegistryService medicalRegistryService;
  private final MedicalRegistryProperties medicalRegistryProperties;
  private final ValidatorFactory validatorFactory;

  public MedicalRegistryImportController(
      Clock clock,
      MedicalRegistryService medicalRegistryService,
      MedicalRegistryProperties medicalRegistryProperties,
      ValidatorFactory validatorFactory) {
    this.medicalRegistryService = medicalRegistryService;
    this.medicalRegistryProperties = medicalRegistryProperties;
    this.validatorFactory = validatorFactory;
  }

  @GetMapping(path = "/template", produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX import template.")
  public ResponseEntity<Resource> getImportTemplate() {
    return getTemplateFileResponse(
        new ClassPathResource(TEMPLATE_FILE_NAME_SERVER), TEMPLATE_FILE_NAME_DOWNLOAD);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional(timeout = 300)
  public ResponseEntity<MultiValueMap<String, Object>> importData(
      @RequestPart("file") MultipartFile file) throws IOException {
    log.info("Importing file ({} bytes)", file.getSize());

    ImportResult result =
        XlsxImport.processWorkbook(
            file,
            medicalRegistryProperties.getMaxNumberOfImportRows(),
            MedicalRegistryColumn.values(),
            (sheet, actualColumns) -> {
              MedicalRegistryImporter importer =
                  new MedicalRegistryImporter(
                      sheet,
                      actualColumns,
                      medicalRegistryService,
                      validatorFactory,
                      IMPORTER_BATCH_SIZE);
              return importer.process();
            });
    log.info(
        "Import finished: Total lines: {}, lines successfully imported: {}, lines failed: {}",
        result.statistics().total(),
        result.statistics().created(),
        result.statistics().failed());
    return FileResponseUtil.mapImportResultToMultipartResponse(
        result, filename(validatorFactory.getClockProvider().getClock()));
  }
}
