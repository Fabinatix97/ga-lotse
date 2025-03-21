/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class BarChartDataExporter {
  private BarChartDataExporter() {}

  static void addData(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      BarChartData barChartData,
      BarChartConfiguration barChartConfiguration) {
    if (barChartConfiguration.getSecondaryAttributeSelection() != null) {
      List<KeyToCount> keyToCountsSample;
      if (barChartData.getBarGroupDatas().isEmpty()) {
        keyToCountsSample = Collections.emptyList();
      } else {
        keyToCountsSample = barChartData.getBarGroupDatas().getFirst().getKeyToCounts();
      }
      addDataHeader(sheet, cellStyleHolder, rowCounter.getAndIncrement(), keyToCountsSample);
    }
    for (BarGroupData barGroupData : barChartData.getBarGroupDatas()) {
      addDataRow(sheet, cellStyleHolder, rowCounter.getAndIncrement(), barGroupData);
    }
  }

  private static void addDataHeader(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, List<KeyToCount> keyToCounts) {
    Row row = sheet.createRow(rowNumber);
    int columnIndex = 1;
    for (KeyToCount keyToCount : keyToCounts) {
      DataExportUtil.createStringCell(row, cellStyleHolder, columnIndex++, keyToCount.getKey());
    }
  }

  private static void addDataRow(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, BarGroupData barGroupData) {
    Row row = sheet.createRow(rowNumber);
    DataExportUtil.createStringCell(row, cellStyleHolder, 0, barGroupData.getKey());
    int columnIndex = 1;
    for (KeyToCount keyToCount : barGroupData.getKeyToCounts()) {
      DataExportUtil.createNumericCell(row, columnIndex++, keyToCount.getCount());
    }
  }
}
