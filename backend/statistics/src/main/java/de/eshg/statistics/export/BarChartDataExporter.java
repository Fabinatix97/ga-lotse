/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class BarChartDataExporter {
  private BarChartDataExporter() {}

  static void addData(
      Sheet sheet,
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

  private static void addDataHeader(Sheet sheet, int rowNumber, List<KeyToCount> keyToCounts) {
    Row row = sheet.createRow(rowNumber);
    int columnIndex = 1;
    for (KeyToCount keyToCount : keyToCounts) {
      row.createCell(columnIndex++, CellType.STRING).setCellValue(keyToCount.getKey());
    }
  }

  private static void addDataRow(Sheet sheet, int rowNumber, BarGroupData barGroupData) {
    Row row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.STRING).setCellValue(barGroupData.getKey());
    int columnIndex = 1;
    for (KeyToCount keyToCount : barGroupData.getKeyToCounts()) {
      row.createCell(columnIndex++, CellType.NUMERIC).setCellValue(keyToCount.getCount());
    }
  }
}
