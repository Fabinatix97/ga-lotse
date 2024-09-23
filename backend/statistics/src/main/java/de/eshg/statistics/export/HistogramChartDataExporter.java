/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static de.eshg.statistics.export.DataExportService.FIRST_COLUMN_WIDTH;

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
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class HistogramChartDataExporter {
  private HistogramChartDataExporter() {}

  static void addData(
      XSSFSheet sheet,
      AtomicInteger rowCounter,
      HistogramChartData histogramChartData,
      HistogramChartConfiguration histogramChartConfiguration) {
    sheet.setColumnWidth(1, FIRST_COLUMN_WIDTH);
    List<KeyToCount> keyToCountsSample;
    if (histogramChartConfiguration.getSecondaryAttributeSelection() == null) {
      keyToCountsSample = Collections.emptyList();
    } else {
      keyToCountsSample = histogramChartData.getHistogramGroupDatas().getFirst().getKeyToCounts();
    }
    addDataHeader(sheet, rowCounter.getAndIncrement(), keyToCountsSample);
    for (HistogramGroupData histogramGroupData : histogramChartData.getHistogramGroupDatas()) {
      addDataRow(sheet, rowCounter.getAndIncrement(), histogramGroupData);
    }
  }

  private static void addDataHeader(XSSFSheet sheet, int rowNumber, List<KeyToCount> keyToCounts) {
    XSSFRow row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.STRING).setCellValue("Bin Untergrenze");
    row.createCell(1, CellType.STRING).setCellValue("Bin Obergrenze");
    int columnIndex = 2;
    for (KeyToCount keyToCount : keyToCounts) {
      row.createCell(columnIndex++, CellType.STRING).setCellValue(keyToCount.getKey());
    }
  }

  private static void addDataRow(
      XSSFSheet sheet, int rowNumber, HistogramGroupData histogramGroupData) {
    XSSFRow row = sheet.createRow(rowNumber);
    row.createCell(0, CellType.NUMERIC)
        .setCellValue(histogramGroupData.getHistogramBin().getLowerBound().doubleValue());
    row.createCell(1, CellType.NUMERIC)
        .setCellValue(histogramGroupData.getHistogramBin().getUpperBound().doubleValue());
    int columnIndex = 2;
    if (histogramGroupData.getCount() == null) {
      for (KeyToCount keyToCount : histogramGroupData.getKeyToCounts()) {
        row.createCell(columnIndex++, CellType.NUMERIC).setCellValue(keyToCount.getCount());
      }
    } else {
      row.createCell(2, CellType.NUMERIC).setCellValue(histogramGroupData.getCount());
    }
  }

  static void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      HistogramChartConfiguration histogramChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    List<HistogramBin> bins = histogramChartConfiguration.getBins();
    BigDecimal averageBinWidth =
        bins.stream()
            .map(bin -> bin.getUpperBound().subtract(bin.getLowerBound()))
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(bins.size()), 4, RoundingMode.HALF_UP);

    DataExportService.addMetadataRow(
        sheet, cellStyle, rowCounter.getAndIncrement(), "Anzahl der Bins", bins.size());
    DataExportService.addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Breite der Bins",
        averageBinWidth.doubleValue());

    DataExportService.getAttributeName(
            histogramChartConfiguration.getPrimaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Zeilen", attributeName));
    DataExportService.getAttributeName(
            histogramChartConfiguration.getSecondaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "Spalten", attributeName));
  }
}
