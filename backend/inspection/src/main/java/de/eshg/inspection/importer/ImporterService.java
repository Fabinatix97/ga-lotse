/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static de.eshg.lib.xlsximport.ImportValidator.validateFileExistsAndHasCorrectType;
import static de.eshg.lib.xlsximport.ImportValidator.validateHeaderExists;
import static de.eshg.lib.xlsximport.ImportValidator.validateSheet;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.util.List;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImporterService {
  private final Clock clock;
  private final ImportPersister importPersister;

  public ImporterService(Clock clock, ImportPersister importPersister) {
    this.clock = clock;
    this.importPersister = importPersister;
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

      return importProcesses(sheet);
    }
  }

  private ImportResult importProcesses(XSSFSheet sheet) throws IOException {
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
      return importer.process();
    }
  }
}
