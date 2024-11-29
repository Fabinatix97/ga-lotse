/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.lib.xlsximport.ImportValidator.validateFileExistsAndHasCorrectType;
import static de.eshg.lib.xlsximport.ImportValidator.validateHeaderExists;
import static de.eshg.lib.xlsximport.ImportValidator.validateSheet;
import static de.eshg.lib.xlsximport.util.FileResponseUtil.filename;
import static de.eshg.lib.xlsximport.util.FileResponseUtil.getTemplateFileResponse;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.medicalregistry.importer.MedicalRegistryImporter;
import de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.time.Clock;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

  private final Clock clock;
  private final MedicalRegistryService medicalRegistryService;

  public MedicalRegistryImportController(
      Clock clock, MedicalRegistryService medicalRegistryService) {
    this.clock = clock;
    this.medicalRegistryService = medicalRegistryService;
  }

  @GetMapping(path = "/template", produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX import template.")
  public ResponseEntity<Resource> getImportTemplate() {
    return getTemplateFileResponse(
        new ClassPathResource(TEMPLATE_FILE_NAME_SERVER), TEMPLATE_FILE_NAME_DOWNLOAD);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<MultiValueMap<String, Object>> importData(
      @RequestPart("file") MultipartFile file) {
    log.info("Importing file ({} bytes)", file.getSize());
    validateFileExistsAndHasCorrectType(file);
    try (InputStream inputStream = file.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      validateSheet(workbook);

      Sheet sheet = workbook.getSheetAt(0);

      validateHeaderExists(sheet);

      ImportResult result = log(normalizeAndImport(sheet));

      return FileResponseUtil.mapImportResultToMultipartResponse(result, filename(clock));
    } catch (IOException e) {
      throw new UncheckedIOException("Error during parsing of uploaded file", e);
    }
  }

  private static ImportResult log(ImportResult result) {
    log.info(
        "Import finished: Total lines: {}, lines successfully imported: {}, lines failed: {}",
        result.statistics().total(),
        result.statistics().created(),
        result.statistics().failed());
    return result;
  }

  private ImportResult normalizeAndImport(Sheet sheet) {
    try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
      return new MedicalRegistryImporter(
              xlsxNormalizer.normalize(sheet), medicalRegistryService, 10_000)
          .process();
    } catch (IOException e) {
      throw new UncheckedIOException("Error during normalizing xlsx sheet", e);
    }
  }
}
