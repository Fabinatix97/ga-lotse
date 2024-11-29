/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.lib.xlsximport.ImportValidator.validateFileExistsAndHasCorrectType;
import static de.eshg.lib.xlsximport.ImportValidator.validateHeaderExists;
import static de.eshg.lib.xlsximport.ImportValidator.validateSheet;
import static java.util.Map.Entry.comparingByKey;
import static java.util.stream.Collectors.joining;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImporterService {
  private static final Logger log = LoggerFactory.getLogger(ImporterService.class);

  private final Clock clock;
  private final ImportPersister importPersister;
  private final AuditLogger auditLogger;

  public ImporterService(Clock clock, ImportPersister importPersister, AuditLogger auditLogger) {
    this.clock = clock;
    this.importPersister = importPersister;
    this.auditLogger = auditLogger;
  }

  /**
   * Imports inspection processes from an Excel file.
   *
   * @param file The multipart file containing the Excel data to be imported.
   * @return An ImportResultDto object that contains the results of the import operation.
   */
  public ImportResult importProcesses(MultipartFile file) throws IOException {
    validateFileExistsAndHasCorrectType(file);

    try (InputStream inputStream = file.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
      validateSheet(workbook);

      XSSFSheet sheet = workbook.getSheetAt(0);
      validateHeaderExists(sheet);

      return importProcesses(sheet, file.getOriginalFilename());
    }
  }

  private ImportResult importProcesses(XSSFSheet sheet, String originalFilename)
      throws IOException {
    try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
      XSSFSheet normalizedSheet = xlsxNormalizer.normalize(sheet);

      List<InspectionListColumn> actualColumns =
          ImportValidator.validateHeaderFormat(InspectionListColumn.values(), normalizedSheet);

      InspectionImporter importer =
          new InspectionImporter(
              normalizedSheet,
              new InspectionProcedureRowReader(
                  normalizedSheet, actualColumns, importPersister, clock),
              new FeedbackColumnAccessor(actualColumns),
              importPersister);

      ImportResult importResult = importer.process();

      logResult(importResult, importer, originalFilename);

      return importResult;
    }
  }

  private void logResult(
      ImportResult importResult, InspectionImporter importer, String originalFilename) {
    Map<String, String> logAttributes =
        Map.of(
            "1. Datei",
            Optional.ofNullable(originalFilename).orElse("-"),
            "2. Betrachtete Datensätze",
            String.valueOf(importResult.statistics().total()),
            "3. Importierte Einrichtungen",
            String.valueOf(importer.getImportedFacilities()),
            "4. davon neu",
            String.valueOf(importer.getImportedNewFacilities()),
            "5. Importierte Vorgänge",
            String.valueOf(importResult.statistics().created()),
            "6. Echte oder potentielle Duplikate",
            String.valueOf(importResult.statistics().duplicated()),
            "7. Fehlerhafte Datensätze",
            String.valueOf(importResult.statistics().failed()),
            "8. User-ID",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log(
        "Vorgangsbearbeitung", "Import Einrichtungen und Begehungsvorgänge", logAttributes);

    String logAttributesAsString =
        logAttributes.entrySet().stream()
            .sorted(comparingByKey())
            .filter(e -> !e.getKey().equals("8. User-ID"))
            .map(e -> "%s: %s".formatted(e.getKey(), e.getValue()))
            .collect(joining(", "));
    log.info("Import Einrichtungen und Begehungsvorgänge durchgeführt; {}", logAttributesAsString);
  }
}
