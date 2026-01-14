/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.chart.Calculation;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class ChoroplethMapDataExporter {
  private ChoroplethMapDataExporter() {}

  static void addData(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      ChoroplethMapData choroplethMapData,
      ChoroplethMapConfiguration choroplethMapConfiguration) {

    addDataHeader(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        mapToString(choroplethMapConfiguration.getCalculation()));

    for (KeyToValue keyToValue : choroplethMapData.getKeyToValues()) {
      addDataRow(sheet, cellStyleHolder, rowCounter.getAndIncrement(), keyToValue);
    }
  }

  private static String mapToString(Calculation calculation) {
    return switch (calculation) {
      case SUM -> "Summe";
      case MEAN -> "Mittelwert";
      case null -> "Anzahl";
    };
  }

  private static void addDataHeader(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, String columnTitle) {
    Row row = sheet.createRow(rowNumber);
    DataExportUtil.createStringCell(row, cellStyleHolder, 1, columnTitle);
  }

  private static void addDataRow(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, KeyToValue keyToValue) {
    Row row = sheet.createRow(rowNumber);
    DataExportUtil.createStringCell(row, cellStyleHolder, 0, keyToValue.getKey());
    if (keyToValue.getValue() != null) {
      DataExportUtil.createNumericCell(row, 1, keyToValue.getValue().doubleValue());
    }
  }
}
