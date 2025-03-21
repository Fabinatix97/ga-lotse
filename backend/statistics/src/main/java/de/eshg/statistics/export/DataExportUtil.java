/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

public class DataExportUtil {
  private static final DateTimeFormatter DATE_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy").withZone(ZoneOffset.UTC);
  private static final String DISCLAIMER_INTERNAL_USAGE =
      "Interner Gebrauch: Der Datensatz enthält personenbezogene Daten und ist daher nur für den internen Gebrauch vorgesehen.";
  private static final String DISCLAIMER_ANONYMOUS =
      "Anonym: Der Datensatz ist anonym und daher für die Verwendung über das Gesundheitsamt hinaus geeignet.";
  static final String SENSITIVE_DATA_ERROR =
      "Data exports are only allowed for non-sensitive evaluations";

  private DataExportUtil() {}

  static CellStyleHolder createCellStyles(Workbook workbook) {
    return new CellStyleHolder(getCellStyleString(workbook), getCellStyleNumeric(workbook));
  }

  private static CellStyle getCellStyleString(Workbook workbook) {
    CellStyle cellStyleString = workbook.createCellStyle();
    cellStyleString.setAlignment(HorizontalAlignment.LEFT);
    cellStyleString.setQuotePrefixed(true);
    return cellStyleString;
  }

  private static CellStyle getCellStyleNumeric(Workbook workbook) {
    CellStyle cellStyleNumeric = workbook.createCellStyle();
    cellStyleNumeric.setAlignment(HorizontalAlignment.LEFT);
    return cellStyleNumeric;
  }

  static void addMetadataBlock(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      AbstractAggregationResult aggregationResult,
      String name,
      String description,
      Integer evaluatedDataAmount) {
    addMetadataRow(sheet, cellStyleHolder, rowCounter.getAndIncrement(), "Name", name);
    if (description != null) {
      addMetadataRow(
          sheet, cellStyleHolder, rowCounter.getAndIncrement(), "Beschreibung", description);
    }
    addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "Zeitraum",
        "%s - %s"
            .formatted(
                DATE_TIME_FORMATTER.format(aggregationResult.getTimeRangeStart()),
                DATE_TIME_FORMATTER.format(aggregationResult.getTimeRangeEnd())));
    addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "Erstellt am",
        DATE_TIME_FORMATTER.format(aggregationResult.getCreatedAt()));
    addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "Datensätze gesamt",
        aggregationResult.getNumberOfTableRows());
    if (evaluatedDataAmount != null) {
      addMetadataRow(
          sheet,
          cellStyleHolder,
          rowCounter.getAndIncrement(),
          "Datensätze ausgewertet",
          evaluatedDataAmount);
    }
    addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "Verwendung",
        getDisclaimer(aggregationResult.getDataSensitivity()));
  }

  static void addMetadataRow(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, String label, String value) {
    Row row = sheet.createRow(rowNumber);
    createStringCell(row, cellStyleHolder, 0, label);
    createStringCell(row, cellStyleHolder, 2, value);
    addMergedRegion(sheet, rowNumber);
  }

  static void addMetadataRow(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, String label, double value) {
    Row row = sheet.createRow(rowNumber);
    createStringCell(row, cellStyleHolder, 0, label);
    createNumericCell(row, cellStyleHolder, value);
    addMergedRegion(sheet, rowNumber);
  }

  static void createStringCell(
      Row row, CellStyleHolder cellStyleHolder, int columnIndex, String value) {
    Cell cell = row.createCell(columnIndex, CellType.STRING);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyleHolder.cellStyleString());
  }

  private static void createNumericCell(Row row, CellStyleHolder cellStyleHolder, double value) {
    Cell cell = row.createCell(2, CellType.NUMERIC);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyleHolder.cellStyleNumeric());
  }

  static void createNumericCell(Row row, int columnIndex, double value) {
    Cell cell = row.createCell(columnIndex, CellType.NUMERIC);
    cell.setCellValue(value);
  }

  private static void addMergedRegion(Sheet sheet, int rowNumber) {
    sheet.addMergedRegion(new CellRangeAddress(rowNumber, rowNumber, 0, 1));
    sheet.addMergedRegion(new CellRangeAddress(rowNumber, rowNumber, 2, 7));
  }

  static String getAttributeName(TableColumn tableColumn, boolean withUnit) {
    return EvaluationMapper.getAttributeDisplayName(tableColumn, withUnit);
  }

  private static String getDisclaimer(StatisticsDataSensitivity dataSensitivity) {
    return switch (dataSensitivity) {
      case ANONYMOUS -> DISCLAIMER_ANONYMOUS;
      case INTERNAL_USAGE -> DISCLAIMER_INTERNAL_USAGE;
      default ->
          throw new IllegalStateException(
              "Data sensitivity not allowed for export: " + dataSensitivity);
    };
  }
}
