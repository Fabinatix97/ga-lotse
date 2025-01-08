/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.PointBasedChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.DataPoint;
import de.eshg.statistics.persistence.entity.diagramdata.DataPointGroup;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class PointBasedChartDataExporter {
  private PointBasedChartDataExporter() {}

  static void addData(
      Sheet sheet,
      AtomicInteger rowCounter,
      LineOrScatterChartData lineOrScatterChartData,
      PointBasedChartConfiguration pointBasedChartConfiguration) {
    if (pointBasedChartConfiguration.getSecondaryAttributeSelection() != null) {
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
      Sheet sheet, int firstRowNumber, int secondRowNumber, List<DataPointGroup> dataPointGroups) {
    Row firstRow = sheet.createRow(firstRowNumber);
    Row secondRow = sheet.createRow(secondRowNumber);
    int columnIndex = 0;
    for (DataPointGroup dataPointGroup : dataPointGroups) {
      firstRow.createCell(columnIndex, CellType.STRING).setCellValue(dataPointGroup.getKey());
      addXYCells(secondRow, columnIndex);
      columnIndex += 3;
    }
  }

  private static void addXYCells(Row row, int xColumnIndex) {
    row.createCell(xColumnIndex, CellType.STRING).setCellValue("x");
    row.createCell(xColumnIndex + 1, CellType.STRING).setCellValue("y");
  }

  private static void addDataRow(
      Sheet sheet, int rowNumber, List<DataPointGroup> dataPointGroups, int dataPointIndex) {
    Row row = sheet.createRow(rowNumber);
    int columnIndex = 0;
    for (DataPointGroup dataPointGroup : dataPointGroups) {
      if (dataPointIndex < dataPointGroup.getDataPoints().size()) {
        addDataPointToRow(row, columnIndex, dataPointGroup.getDataPoints().get(dataPointIndex));
      }
      columnIndex += 3;
    }
  }

  private static void addDataPointToRow(Row row, int xColumnIndex, DataPoint dataPoint) {
    row.createCell(xColumnIndex, CellType.NUMERIC)
        .setCellValue(dataPoint.getXCoordinate().doubleValue());
    row.createCell(xColumnIndex + 1, CellType.NUMERIC)
        .setCellValue(dataPoint.getYCoordinate().doubleValue());
  }

  static void addAttributesInformation(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      PointBasedChartConfiguration pointBasedChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "x-Achse",
        DiagramExportService.getAttributeName(
            pointBasedChartConfiguration.getXAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyle,
        rowCounter,
        aggregationResult,
        pointBasedChartConfiguration.getXAttributeSelection());
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "y-Achse",
        DiagramExportService.getAttributeName(
            pointBasedChartConfiguration.getYAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyle,
        rowCounter,
        aggregationResult,
        pointBasedChartConfiguration.getYAttributeSelection());
    Optional.ofNullable(pointBasedChartConfiguration.getSecondaryAttributeSelection())
        .ifPresent(
            secondaryAttribute -> {
              DataExportUtil.addMetadataRow(
                  sheet,
                  cellStyle,
                  rowCounter.getAndIncrement(),
                  "Sekundäres Attribut",
                  DiagramExportService.getAttributeName(secondaryAttribute, aggregationResult));
              DiagramExportService.addLegend(
                  sheet, cellStyle, rowCounter, aggregationResult, secondaryAttribute);
            });
  }
}
