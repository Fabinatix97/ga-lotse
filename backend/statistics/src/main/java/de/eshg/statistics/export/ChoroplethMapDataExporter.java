/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.Calculation;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class ChoroplethMapDataExporter {
  private ChoroplethMapDataExporter() {}

  static void addData(
      XSSFSheet sheet,
      AtomicInteger rowCounter,
      ChoroplethMapData choroplethMapData,
      ChoroplethMapConfiguration choroplethMapConfiguration) {

    addDataHeader(
        sheet,
        rowCounter.getAndIncrement(),
        mapToString(choroplethMapConfiguration.getCalculation()));

    for (KeyToValue keyToValue : choroplethMapData.getKeyToValues()) {
      addDataRow(sheet, rowCounter.getAndIncrement(), keyToValue);
    }
  }

  private static String mapToString(Calculation calculation) {
    return switch (calculation) {
      case SUM -> "Summe";
      case MEAN -> "Mittelwert";
      case null -> "Anzahl";
    };
  }

  private static void addDataHeader(XSSFSheet sheet, int rowNumber, String columnTitle) {
    XSSFRow row = sheet.createRow(rowNumber);
    row.createCell(1, CellType.STRING).setCellValue(columnTitle);
  }

  private static void addDataRow(XSSFSheet sheet, int rowNumber, KeyToValue keyToValue) {
    XSSFRow row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.STRING).setCellValue(keyToValue.getKey());
    if (keyToValue.getValue() != null) {
      row.createCell(1, CellType.NUMERIC).setCellValue(keyToValue.getValue().doubleValue());
    }
  }

  static void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      ChoroplethMapConfiguration choroplethMapConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportService.getAttributeName(
            choroplethMapConfiguration.getPrimaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Zeilen", attributeName));
    DataExportService.getAttributeName(
            choroplethMapConfiguration.getSecondaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Spalten", attributeName));
  }
}
