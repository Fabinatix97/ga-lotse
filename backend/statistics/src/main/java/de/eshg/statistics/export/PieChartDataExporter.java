/*
 * Copyright 2025 cronn GmbH
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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class PieChartDataExporter {
  private PieChartDataExporter() {}

  static void addData(Sheet sheet, AtomicInteger rowCounter, PieChartData pieChartData) {
    for (KeyToCount keyToCount : pieChartData.getKeyToCounts()) {
      Row row = sheet.createRow(rowCounter.getAndIncrement());
      row.createCell(0, CellType.STRING).setCellValue(keyToCount.getKey());
      row.createCell(1, CellType.NUMERIC).setCellValue(keyToCount.getCount());
    }
  }

  static void addAttributesInformation(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      PieChartConfiguration pieChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Zeilen",
        DiagramExportService.getAttributeName(
            pieChartConfiguration.getAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyle,
        rowCounter,
        aggregationResult,
        pieChartConfiguration.getAttributeSelection());
  }
}
