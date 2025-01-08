/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.chart.Calculation;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class ChoroplethMapDataExporter {
  private ChoroplethMapDataExporter() {}

  static void addData(
      Sheet sheet,
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

  private static void addDataHeader(Sheet sheet, int rowNumber, String columnTitle) {
    Row row = sheet.createRow(rowNumber);
    row.createCell(1, CellType.STRING).setCellValue(columnTitle);
  }

  private static void addDataRow(Sheet sheet, int rowNumber, KeyToValue keyToValue) {
    Row row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.STRING).setCellValue(keyToValue.getKey());
    if (keyToValue.getValue() != null) {
      row.createCell(1, CellType.NUMERIC).setCellValue(keyToValue.getValue().doubleValue());
    }
  }
}
