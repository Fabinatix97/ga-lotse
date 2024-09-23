/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class BarChartDataExporter {
  private BarChartDataExporter() {}

  static void addData(
      XSSFSheet sheet,
      AtomicInteger rowCounter,
      BarChartData barChartData,
      BarChartConfiguration barChartConfiguration) {
    if (barChartConfiguration.getSecondaryAttributeSelection() != null) {
      List<KeyToCount> keyToCountsSample =
          barChartData.getBarGroupDatas().getFirst().getKeyToCounts();
      addDataHeader(sheet, rowCounter.getAndIncrement(), keyToCountsSample);
    }
    for (BarGroupData barGroupData : barChartData.getBarGroupDatas()) {
      addDataRow(sheet, rowCounter.getAndIncrement(), barGroupData);
    }
  }

  private static void addDataHeader(XSSFSheet sheet, int rowNumber, List<KeyToCount> keyToCounts) {
    XSSFRow row = sheet.createRow(rowNumber);
    int columnIndex = 1;
    for (KeyToCount keyToCount : keyToCounts) {
      row.createCell(columnIndex++, CellType.STRING).setCellValue(keyToCount.getKey());
    }
  }

  private static void addDataRow(XSSFSheet sheet, int rowNumber, BarGroupData barGroupData) {
    XSSFRow row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.STRING).setCellValue(barGroupData.getKey());
    int columnIndex = 1;
    for (KeyToCount keyToCount : barGroupData.getKeyToCounts()) {
      row.createCell(columnIndex++, CellType.NUMERIC).setCellValue(keyToCount.getCount());
    }
  }

  static void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      BarChartConfiguration barChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportService.getAttributeName(
            barChartConfiguration.getPrimaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Zeilen", attributeName));
    DataExportService.getAttributeName(
            barChartConfiguration.getSecondaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Spalten", attributeName));
  }
}
