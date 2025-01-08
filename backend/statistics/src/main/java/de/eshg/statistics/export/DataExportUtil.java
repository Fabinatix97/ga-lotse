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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
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

  static void addMetadataBlock(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      AbstractAggregationResult aggregationResult,
      String name,
      String description,
      Integer evaluatedDataAmount) {
    addMetadataRow(sheet, cellStyle, rowCounter.getAndIncrement(), "Name", name);
    if (description != null) {
      addMetadataRow(sheet, cellStyle, rowCounter.getAndIncrement(), "Beschreibung", description);
    }
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Zeitraum",
        "%s - %s"
            .formatted(
                DATE_TIME_FORMATTER.format(aggregationResult.getTimeRangeStart()),
                DATE_TIME_FORMATTER.format(aggregationResult.getTimeRangeEnd())));
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Erstellt am",
        DATE_TIME_FORMATTER.format(aggregationResult.getCreatedAt()));
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Datensätze gesamt",
        aggregationResult.getNumberOfTableRows());
    if (evaluatedDataAmount != null) {
      addMetadataRow(
          sheet,
          cellStyle,
          rowCounter.getAndIncrement(),
          "Datensätze ausgewertet",
          evaluatedDataAmount);
    }
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Verwendung",
        getDisclaimer(aggregationResult.getDataSensitivity()));
  }

  static void addMetadataRow(
      Sheet sheet, CellStyle cellStyle, int rowNumber, String label, String value) {
    Row row = sheet.createRow(rowNumber);
    createMetadataCell(row, cellStyle, 0, label);
    createMetadataCell(row, cellStyle, 2, value);
    addMergedRegion(sheet, rowNumber);
  }

  static void addMetadataRow(
      Sheet sheet, CellStyle cellStyle, int rowNumber, String label, double value) {
    Row row = sheet.createRow(rowNumber);
    createMetadataCell(row, cellStyle, 0, label);
    createMetadataCell(row, cellStyle, value);
    addMergedRegion(sheet, rowNumber);
  }

  static void createMetadataCell(Row row, CellStyle cellStyle, int columnIndex, String value) {
    Cell cell = row.createCell(columnIndex, CellType.STRING);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }

  private static void createMetadataCell(Row row, CellStyle cellStyle, double value) {
    Cell cell = row.createCell(2, CellType.NUMERIC);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
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
