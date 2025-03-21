/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static de.eshg.statistics.export.DiagramExportService.FIRST_COLUMN_WIDTH;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class HistogramChartDataExporter {
  private HistogramChartDataExporter() {}

  static void addData(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      HistogramChartData histogramChartData,
      HistogramChartConfiguration histogramChartConfiguration) {
    sheet.setColumnWidth(1, FIRST_COLUMN_WIDTH);
    List<KeyToCount> keyToCountsSample;
    if (histogramChartConfiguration.getSecondaryAttributeSelection() == null
        || histogramChartData.getHistogramGroupDatas().isEmpty()) {
      keyToCountsSample = Collections.emptyList();
    } else {
      keyToCountsSample = histogramChartData.getHistogramGroupDatas().getFirst().getKeyToCounts();
    }
    addDataHeader(sheet, cellStyleHolder, rowCounter.getAndIncrement(), keyToCountsSample);
    for (HistogramGroupData histogramGroupData : histogramChartData.getHistogramGroupDatas()) {
      addDataRow(sheet, rowCounter.getAndIncrement(), histogramGroupData);
    }
  }

  private static void addDataHeader(
      Sheet sheet, CellStyleHolder cellStyleHolder, int rowNumber, List<KeyToCount> keyToCounts) {
    Row row = sheet.createRow(rowNumber);
    DataExportUtil.createStringCell(row, cellStyleHolder, 0, "Bin Untergrenze");
    DataExportUtil.createStringCell(row, cellStyleHolder, 1, "Bin Obergrenze");
    int columnIndex = 2;
    for (KeyToCount keyToCount : keyToCounts) {
      DataExportUtil.createStringCell(row, cellStyleHolder, columnIndex++, keyToCount.getKey());
    }
  }

  private static void addDataRow(
      Sheet sheet, int rowNumber, HistogramGroupData histogramGroupData) {
    Row row = sheet.createRow(rowNumber);
    DataExportUtil.createNumericCell(
        row, 0, histogramGroupData.getHistogramBin().getLowerBound().doubleValue());
    DataExportUtil.createNumericCell(
        row, 1, histogramGroupData.getHistogramBin().getUpperBound().doubleValue());
    int columnIndex = 2;
    if (histogramGroupData.getCount() == null) {
      for (KeyToCount keyToCount : histogramGroupData.getKeyToCounts()) {
        DataExportUtil.createNumericCell(row, columnIndex++, keyToCount.getCount());
      }
    } else {
      DataExportUtil.createNumericCell(row, 2, histogramGroupData.getCount());
    }
  }

  static void addHistogramAttributesInformation(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      HistogramChartConfiguration histogramChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    List<HistogramBin> bins = histogramChartConfiguration.getBins();
    if (bins.isEmpty()) {
      DataExportUtil.addMetadataRow(
          sheet, cellStyleHolder, rowCounter.getAndIncrement(), "Anzahl der Bins", 0);
      DataExportUtil.addMetadataRow(
          sheet, cellStyleHolder, rowCounter.getAndIncrement(), "Breite der Bins", "");
    } else {
      BigDecimal averageBinWidth =
          bins.stream()
              .map(bin -> bin.getUpperBound().subtract(bin.getLowerBound()))
              .reduce(BigDecimal.ZERO, BigDecimal::add)
              .divide(BigDecimal.valueOf(bins.size()), 4, RoundingMode.HALF_UP);

      DataExportUtil.addMetadataRow(
          sheet, cellStyleHolder, rowCounter.getAndIncrement(), "Anzahl der Bins", bins.size());
      DataExportUtil.addMetadataRow(
          sheet,
          cellStyleHolder,
          rowCounter.getAndIncrement(),
          "Breite der Bins",
          averageBinWidth.doubleValue());
    }

    TwoAttributesChartDataExporter.addAttributesInformation(
        sheet, cellStyleHolder, rowCounter, histogramChartConfiguration, aggregationResult);
  }
}
