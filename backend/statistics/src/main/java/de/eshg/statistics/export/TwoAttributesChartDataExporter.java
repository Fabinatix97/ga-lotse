/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.chart.TwoAttributesChartConfiguration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Sheet;

public class TwoAttributesChartDataExporter {
  private TwoAttributesChartDataExporter() {}

  public static void addAttributesInformation(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      TwoAttributesChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    DataExportUtil.addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Zeilen",
        DiagramExportService.getAttributeName(
            chartConfiguration.getPrimaryAttributeSelection(), aggregationResult));
    DiagramExportService.addLegend(
        sheet,
        cellStyle,
        rowCounter,
        aggregationResult,
        chartConfiguration.getPrimaryAttributeSelection());
    Optional.ofNullable(chartConfiguration.getSecondaryAttributeSelection())
        .ifPresent(
            secondaryAttribute -> {
              DataExportUtil.addMetadataRow(
                  sheet,
                  cellStyle,
                  rowCounter.getAndIncrement(),
                  "Spalten",
                  DiagramExportService.getAttributeName(secondaryAttribute, aggregationResult));
              DiagramExportService.addLegend(
                  sheet, cellStyle, rowCounter, aggregationResult, secondaryAttribute);
            });
  }
}
