/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class PieChartDataExporter {
  private PieChartDataExporter() {}

  static void addData(XSSFSheet sheet, AtomicInteger rowCounter, PieChartData pieChartData) {
    for (KeyToCount keyToCount : pieChartData.getKeyToCounts()) {
      XSSFRow row = sheet.createRow(rowCounter.getAndIncrement());
      row.createCell(0, CellType.STRING).setCellValue(keyToCount.getKey());
      row.createCell(1, CellType.NUMERIC).setCellValue(keyToCount.getCount());
    }
  }

  static void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      PieChartConfiguration pieChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportService.getAttributeName(
            pieChartConfiguration.getAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Zeilen", attributeName));
  }
}
