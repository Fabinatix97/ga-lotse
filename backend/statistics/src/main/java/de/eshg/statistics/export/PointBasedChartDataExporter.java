/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.LineOrScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.DataPoint;
import de.eshg.statistics.persistence.entity.diagramdata.DataPointGroup;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class PointBasedChartDataExporter {
  private PointBasedChartDataExporter() {}

  static void addData(
      XSSFSheet sheet,
      AtomicInteger rowCounter,
      LineOrScatterChartData lineOrScatterChartData,
      LineOrScatterChartConfiguration lineOrScatterChartConfiguration) {
    if (lineOrScatterChartConfiguration.getSecondaryAttributeSelection() != null) {
      addDataHeader(
          sheet,
          rowCounter.getAndIncrement(),
          rowCounter.getAndIncrement(),
          lineOrScatterChartData.getDataPointGroups());
      int maxSize =
          lineOrScatterChartData.getDataPointGroups().stream()
              .map(dataPointGroup -> dataPointGroup.getDataPoints().size())
              .max(Integer::compare)
              .orElse(0);
      for (int i = 0; i < maxSize; i++) {
        addDataRow(
            sheet, rowCounter.getAndIncrement(), lineOrScatterChartData.getDataPointGroups(), i);
      }
    } else {
      addXYCells(sheet.createRow(rowCounter.getAndIncrement()), 0);
      for (DataPoint dataPoint :
          lineOrScatterChartData.getDataPointGroups().getFirst().getDataPoints()) {
        addDataPointToRow(sheet.createRow(rowCounter.getAndIncrement()), 0, dataPoint);
      }
    }
  }

  private static void addDataHeader(
      XSSFSheet sheet,
      int firstRowNumber,
      int secondRowNumber,
      List<DataPointGroup> dataPointGroups) {
    XSSFRow firstRow = sheet.createRow(firstRowNumber);
    XSSFRow secondRow = sheet.createRow(secondRowNumber);
    int columnIndex = 0;
    for (DataPointGroup dataPointGroup : dataPointGroups) {
      firstRow.createCell(columnIndex, CellType.STRING).setCellValue(dataPointGroup.getKey());
      addXYCells(secondRow, columnIndex);
      columnIndex += 3;
    }
  }

  private static void addXYCells(XSSFRow row, int xColumnIndex) {
    row.createCell(xColumnIndex, CellType.STRING).setCellValue("x");
    row.createCell(xColumnIndex + 1, CellType.STRING).setCellValue("y");
  }

  private static void addDataRow(
      XSSFSheet sheet, int rowNumber, List<DataPointGroup> dataPointGroups, int dataPointIndex) {
    XSSFRow row = sheet.createRow(rowNumber);
    int columnIndex = 0;
    for (DataPointGroup dataPointGroup : dataPointGroups) {
      if (dataPointIndex < dataPointGroup.getDataPoints().size()) {
        addDataPointToRow(row, columnIndex, dataPointGroup.getDataPoints().get(dataPointIndex));
      }
      columnIndex += 3;
    }
  }

  private static void addDataPointToRow(XSSFRow row, int xColumnIndex, DataPoint dataPoint) {
    row.createCell(xColumnIndex, CellType.NUMERIC)
        .setCellValue(dataPoint.getXCoordinate().doubleValue());
    row.createCell(xColumnIndex + 1, CellType.NUMERIC)
        .setCellValue(dataPoint.getYCoordinate().doubleValue());
  }

  static void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      LineOrScatterChartConfiguration lineOrScatterChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportService.getAttributeName(
            lineOrScatterChartConfiguration.getXAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "x-Achse", attributeName));
    DataExportService.getAttributeName(
            lineOrScatterChartConfiguration.getYAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet, cellStyle, rowCounter.getAndIncrement(), "y-Achse", attributeName));
    DataExportService.getAttributeName(
            lineOrScatterChartConfiguration.getSecondaryAttributeSelection(), aggregationResult)
        .ifPresent(
            attributeName ->
                DataExportService.addMetadataRow(
                    sheet,
                    cellStyle,
                    rowCounter.getAndIncrement(),
                    "Sekundäres Attribut",
                    attributeName));
  }
}
