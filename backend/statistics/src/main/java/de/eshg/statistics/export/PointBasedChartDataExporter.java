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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class PointBasedChartDataExporter {
  private PointBasedChartDataExporter() {}

  static void addData(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      LineOrScatterChartData lineOrScatterChartData,
      PointBasedChartConfiguration pointBasedChartConfiguration) {
    if (pointBasedChartConfiguration.getSecondaryAttributeSelection() != null) {
      addDataHeader(
          sheet,
          cellStyleHolder,
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
      addXYCells(sheet.createRow(rowCounter.getAndIncrement()), cellStyleHolder, 0);
      for (DataPoint dataPoint :
          lineOrScatterChartData.getDataPointGroups().getFirst().getDataPoints()) {
        addDataPointToRow(sheet.createRow(rowCounter.getAndIncrement()), 0, dataPoint);
      }
    }
  }

  private static void addDataHeader(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      int firstRowNumber,
      int secondRowNumber,
      List<DataPointGroup> dataPointGroups) {
    Row firstRow = sheet.createRow(firstRowNumber);
    Row secondRow = sheet.createRow(secondRowNumber);
    int columnIndex = 0;
    for (DataPointGroup dataPointGroup : dataPointGroups) {
      DataExportUtil.createStringCell(
          firstRow, cellStyleHolder, columnIndex, dataPointGroup.getKey());
      addXYCells(secondRow, cellStyleHolder, columnIndex);
      columnIndex += 3;
    }
  }

  private static void addXYCells(Row row, CellStyleHolder cellStyleHolder, int xColumnIndex) {
    DataExportUtil.createStringCell(row, cellStyleHolder, xColumnIndex, "x");
    DataExportUtil.createStringCell(row, cellStyleHolder, xColumnIndex + 1, "y");
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
    DataExportUtil.createNumericCell(row, xColumnIndex, dataPoint.getXCoordinate().doubleValue());
    DataExportUtil.createNumericCell(
        row, xColumnIndex + 1, dataPoint.getYCoordinate().doubleValue());
  }

  static void addAttributesInformation(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      PointBasedChartConfiguration pointBasedChartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "x-Achse",
        DiagramExportService.getAttributeName(
            pointBasedChartConfiguration.getXAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyleHolder,
        rowCounter,
        aggregationResult,
        pointBasedChartConfiguration.getXAttributeSelection());
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyleHolder,
        rowCounter.getAndIncrement(),
        "y-Achse",
        DiagramExportService.getAttributeName(
            pointBasedChartConfiguration.getYAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyleHolder,
        rowCounter,
        aggregationResult,
        pointBasedChartConfiguration.getYAttributeSelection());
    Optional.ofNullable(pointBasedChartConfiguration.getSecondaryAttributeSelection())
        .ifPresent(
            secondaryAttribute -> {
              DataExportUtil.addMetadataRow(
                  sheet,
                  cellStyleHolder,
                  rowCounter.getAndIncrement(),
                  "Sekundäres Attribut",
                  DiagramExportService.getAttributeName(secondaryAttribute, aggregationResult));
              DiagramExportService.addLegend(
                  sheet, cellStyleHolder, rowCounter, aggregationResult, secondaryAttribute);
            });
  }
}
