/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.EXCEPTION;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_PREVIOUSLY;
import static de.eshg.lib.xlsximport.ImportStatus.INVALID_ENTITY_ID;
import static de.eshg.lib.xlsximport.ImportStatus.MERGE_FAILED;
import static de.eshg.lib.xlsximport.util.XlsxUtil.writeValue;
import static java.util.function.Predicate.not;

import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.model.ImportStatistics;
import de.eshg.lib.xlsximport.util.XlsxUtil;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.Assert;

public abstract class Importer<R extends RowData<R>, C extends XlsxColumn> {

  private static final Logger log = LoggerFactory.getLogger(Importer.class);

  protected final XSSFSheet sheet;
  protected final RowReader<R, C> rowReader;
  private final List<R> validRows = new ArrayList<>();
  protected final ImportStatistics stats = new ImportStatistics();
  private final FeedbackColumnAccessor col;
  private final XSSFCellStyle defaultCellStyle;
  private final XSSFCellStyle importedSuccessfullyCellStyle;
  private final XSSFCellStyle importFailedCellStyle;
  private final XSSFCellStyle importWarningCellStyle;

  protected Importer(
      XSSFSheet sheet, RowReader<R, C> rowReader, FeedbackColumnAccessor feedbackColumnAccessor) {
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

  protected void addToImportableRows(R row) {
    Assert.isTrue(!row.isMergeable(), "Row must not be marked as mergeable");
    addValidRow(row);
  }

  protected void addToMergeableRows(R row) {
    Assert.isTrue(!row.isMergeable(), "Row is already marked as mergeable");
    row.markAsMergeable();
    addValidRow(row);
  }

  private void addValidRow(R row) {
    Assert.isTrue(row.isValid(), "Row must be valid");
    validRows.add(row);
  }

  protected Stream<R> streamMergeableRows() {
    return validRows.stream().filter(RowData::isMergeable);
  }

  protected Stream<R> streamImportableRows() {
    return validRows.stream().filter(not(RowData::isMergeable));
  }

  public ImportResult process() throws IOException {
    List<R> rows = readRows();
    evaluateActionsForRows(rows);

    createEntitiesAndWriteResults(streamImportableRows().toList());
    mergeEntitiesAndWriteResults(streamMergeableRows().toList());

    return mapImportResult();
  }

  protected abstract void evaluateActionsForRows(List<R> rows);

  protected void markAsDuplicateWithinList(R row) {
    writeStatus(row, DUPLICATE_WITHIN_LIST);
    row.setStatus(DUPLICATE_WITHIN_LIST);
    stats.countDuplicated();
  }

  protected void markAsInvalidEntityId(R row) {
    writeStatus(row, INVALID_ENTITY_ID);
    stats.countFailed();
  }

  protected void markAsImportedPreviously(R row) {
    writeStatus(row, IMPORTED_PREVIOUSLY);
    stats.countPreviouslyImported();
  }

  protected void markAsInputDataError(R row) {
    writeStatus(row, ERROR_INPUT_DATA);
    stats.countFailed();
  }

  protected abstract void createEntitiesAndWriteResults(List<R> importableRows);

  protected void mergeEntitiesAndWriteResults(List<R> mergeableRows) {
    if (!mergeableRows.isEmpty()) {
      throw new UnsupportedOperationException(
          "Merge is not supported. Got %d rows to merge.".formatted(mergeableRows.size()));
    }
  }

  protected boolean shouldSkipReadingRow(Row row) {
    return row.getRowNum() == 0;
  }

  private ImportResult mapImportResult() throws IOException {
    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      sheet.getWorkbook().write(outputStream);
      ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

      return new ImportResult(stats.mapToDto(), resource);
    }
  }

  private List<R> readRows() {
    List<R> rows = new ArrayList<>();
    for (Row xlsxRow : sheet) {
      if (shouldSkipReadingRow(xlsxRow)) {
        // skip non data rows
        continue;
      }
      if (RowReader.isEmpty(xlsxRow)) {
        // sometimes a row has no cells but still shows up
        continue;
      }
      deleteReferenceId(xlsxRow);
      try {
        R row = rowReader.readRow(xlsxRow);
        rows.add(row);
      } catch (Exception e) {
        log.error("Error in reading row {}", xlsxRow.getRowNum(), e);
        writeStatus(xlsxRow, EXCEPTION);
        stats.countFailed();
      }
    }
    return rows;
  }

  protected boolean isDuplicateRow(R rowToCheck) {
    return rowToCheck.getStatus() == DUPLICATE_WITHIN_LIST
        || validRows.stream().anyMatch(row -> row.isDuplicateRow(rowToCheck));
  }

  private void deleteReferenceId(Row row) {
    if (col.hasReferenceIdColum()) {
      writeValue(col.getReferenceId(row), "", defaultCellStyle);
    }
  }

  protected void writeStatusAndEntityId(RowData<?> row, ImportStatus status, UUID entityId) {
    writeStatus(row, status);
    writeValue(col.getEntityId(row.getXlsxRow()), entityId.toString(), defaultCellStyle);
  }

  private void deleteEntityId(RowData<?> row) {
    writeValue(col.getEntityId(row.getXlsxRow()), "", defaultCellStyle);
  }

  protected void writeStatusAndReferenceId(RowData<?> row, ImportStatus status, UUID referenceId) {
    writeStatus(row, status);
    writeValue(col.getReferenceId(row.getXlsxRow()), referenceId.toString(), defaultCellStyle);
  }

  protected void writeStatus(RowData<?> row, ImportStatus importStatus) {
    writeStatus(row.getXlsxRow(), importStatus);
  }

  private void writeStatus(Row row, ImportStatus importStatus) {
    writeValue(col.getStatus(row), importStatus.getDescription(), getCellStyle(importStatus));
  }

  private XSSFCellStyle getCellStyle(ImportStatus importStatus) {
    return switch (importStatus) {
      case IMPORTED_SUCCESSFULLY, MERGED_SUCCESSFULLY -> importedSuccessfullyCellStyle;
      case ERROR_INPUT_DATA, INVALID_ENTITY_ID, EXCEPTION, MERGE_FAILED, BATCH_ERROR ->
          importFailedCellStyle;
      case IMPORTED_PREVIOUSLY, DUPLICATE_WITHIN_LIST, DUPLICATE_IN_ASSET -> importWarningCellStyle;
    };
  }

  protected void writeMergedFailedStatusInSheet(
      List<R> mergeableRows, List<UUID> failedProcedureIds) {
    for (UUID failedProcedureId : failedProcedureIds) {
      mergeableRows.stream()
          .filter(row -> Objects.equals(failedProcedureId, row.getEntityId()))
          .forEach(
              row -> {
                deleteEntityId(row);
                writeStatusAndReferenceId(row, MERGE_FAILED, failedProcedureId);
              });
    }
  }

  protected void writeFailedStatusInSheet(List<R> importableRows) {
    for (R row : importableRows) {
      writeStatus(row, EXCEPTION);
    }
  }
}
