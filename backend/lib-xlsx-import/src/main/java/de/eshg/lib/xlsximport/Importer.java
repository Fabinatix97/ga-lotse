/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import static de.eshg.lib.xlsximport.ImportStatus.EXCEPTION;
import static de.eshg.lib.xlsximport.ImportStatus.MERGE_FAILED;
import static de.eshg.lib.xlsximport.util.XlsxUtil.writeValue;

import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.XlsxUtil;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Consumer;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;

public abstract class Importer<T extends RowValues, C extends XlsxColumn> {

  private static final Logger log = LoggerFactory.getLogger(Importer.class);

  protected final XSSFSheet sheet;
  protected final RowReader<T, C> rowReader;
  protected final ValidRows<T> validRows = new ValidRows<>(new ArrayList<>(), new ArrayList<>());
  protected final ImportStatistics stats = new ImportStatistics();
  private final FeedbackColumnAccessor col;
  private final XSSFCellStyle defaultCellStyle;
  private final XSSFCellStyle importedSuccessfullyCellStyle;
  private final XSSFCellStyle importFailedCellStyle;
  private final XSSFCellStyle importWarningCellStyle;

  protected Importer(
      XSSFSheet sheet, RowReader<T, C> rowReader, FeedbackColumnAccessor feedbackColumnAccessor) {
    this.sheet = sheet;
    this.rowReader = rowReader;
    this.col = feedbackColumnAccessor;
    this.defaultCellStyle = createDefaultCellStyle();

    this.importedSuccessfullyCellStyle =
        createCellStyle(
            font -> {
              font.setBold(true);
              font.setColor(XlsxUtil.newColor(76, 175, 80));
            });

    this.importFailedCellStyle =
        createCellStyle(
            font -> {
              font.setBold(true);
              font.setColor(XlsxUtil.newColor(176, 0, 0));
            });

    importWarningCellStyle =
        createCellStyle(
            font -> {
              font.setBold(true);
              font.setColor(XlsxUtil.newColor(228, 114, 0));
            });
  }

  private XSSFCellStyle createCellStyle(Consumer<XSSFFont> fontCustomizer) {
    XSSFCellStyle cellStyle = createDefaultCellStyle();
    XSSFFont font = cellStyle.getFont();
    fontCustomizer.accept(font);
    return cellStyle;
  }

  private XSSFCellStyle createDefaultCellStyle() {
    XSSFWorkbook workbook = sheet.getWorkbook();
    XSSFCellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setFont(XlsxUtil.createDefaultFont(workbook));
    return cellStyle;
  }

  protected record ValidRows<T>(List<T> importableRows, List<T> mergeableRows) {}

  public ImportResult process() throws IOException {
    readRowsAndEvaluateActions();

    createProceduresAndWriteResults();
    mergeProceduresAndWriteResults();

    return mapImportResult();
  }

  protected abstract void readRowsAndEvaluateActions();

  protected abstract void createProceduresAndWriteResults();

  protected abstract void mergeProceduresAndWriteResults();

  private ImportResult mapImportResult() throws IOException {
    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      sheet.getWorkbook().write(outputStream);
      ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

      return new ImportResult(stats.mapToDto(), resource);
    }
  }

  protected Map<Row, T> readRows() {
    Map<Row, T> rowValues = new LinkedHashMap<>();
    for (Row row : sheet) {
      if (row.getRowNum() == 0) {
        // skip the header
        continue;
      }
      if (RowReader.isEmpty(row)) {
        // sometimes a row has no cells but still shows up
        continue;
      }
      deleteReferenceId(row);
      try {
        rowValues.put(row, rowReader.readRow(row));
      } catch (Exception e) {
        log.error("Error in reading row %d".formatted(row.getRowNum()), e);
        writeStatus(row, EXCEPTION);
        stats.countFailed();
      }
    }
    return rowValues;
  }

  private void deleteReferenceId(Row row) {
    if (col.hasReferenceIdColum()) {
      writeValue(col.getReferenceId(row), "", defaultCellStyle);
    }
  }

  protected void writeStatusAndProcedureId(Row row, ImportStatus status, UUID procedureId) {
    writeStatus(row, status);
    writeValue(col.getProcedureId(row), procedureId.toString(), defaultCellStyle);
  }

  private void deleteProcedureId(Row row) {
    writeValue(col.getProcedureId(row), "", defaultCellStyle);
  }

  protected void writeStatusAndReferenceId(Row row, ImportStatus status, UUID referenceId) {
    writeStatus(row, status);
    writeValue(col.getReferenceId(row), referenceId.toString(), defaultCellStyle);
  }

  protected void writeStatus(Row row, ImportStatus importStatus) {
    writeValue(col.getStatus(row), importStatus.getDescription(), getCellStyle(importStatus));
  }

  private XSSFCellStyle getCellStyle(ImportStatus importStatus) {
    return switch (importStatus) {
      case IMPORTED_SUCCESSFULLY, MERGED_SUCCESSFULLY -> importedSuccessfullyCellStyle;
      case ERROR_INPUT_DATA, INVALID_PROCEDURE_ID, EXCEPTION, MERGE_FAILED, BATCH_ERROR ->
          importFailedCellStyle;
      case IMPORTED_PREVIOUSLY, DUPLICATE_WITHIN_LIST, DUPLICATE_IN_ASSET -> importWarningCellStyle;
    };
  }

  protected void writeMergedFailedStatusInSheet(
      List<T> mergeableRows, List<UUID> failedProcedureIds) {
    for (UUID failedProcedureId : failedProcedureIds) {
      mergeableRows.stream()
          .filter(rowValues -> Objects.equals(failedProcedureId, rowValues.getProcedureId()))
          .map(RowValues::getRow)
          .forEach(
              row -> {
                deleteProcedureId(row);
                writeStatusAndReferenceId(row, MERGE_FAILED, failedProcedureId);
              });
    }
  }

  protected void writeFailedStatusInSheet(List<T> importableRows) {
    for (T rowValues : importableRows) {
      writeStatus(rowValues.getRow(), EXCEPTION);
    }
  }
}
