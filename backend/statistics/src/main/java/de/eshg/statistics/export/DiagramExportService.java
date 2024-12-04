/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static de.eshg.statistics.StatisticsApplication.MODULE_NAME;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PointBasedChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.TwoAttributesChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Hibernate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
public class DiagramExportService {
  private static final String UNEXPECTED_VALUE = "Unexpected value: %s";
  static final int FIRST_COLUMN_WIDTH = 16 * 256;

  private final AnalysisService analysisService;
  private final AuditLogger auditLogger;

  public DiagramExportService(AnalysisService analysisService, AuditLogger auditLogger) {
    this.analysisService = analysisService;
    this.auditLogger = auditLogger;
  }

  public void checkExportAllowed(UUID diagramId) {
    analysisService.checkPermissionForDiagram(diagramId);
  }

  @Transactional(readOnly = true)
  public Resource exportData(UUID diagramId) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);
    AbstractAggregationResult aggregationResult =
        Hibernate.unproxy(
            diagram.getAnalysis().getAggregationResult(), AbstractAggregationResult.class);
    if (aggregationResult instanceof Evaluation evaluation && !evaluation.isAnonymized()) {
      throw new BadRequestException(DataExportUtil.NOT_ANONYMIZED_ERROR);
    }

    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      ChartConfiguration chartConfiguration =
          Hibernate.unproxy(
              diagram.getAnalysis().getChartConfiguration(), ChartConfiguration.class);

      addDetails(workbook, aggregationResult, diagram, chartConfiguration);
      addDiagramData(workbook, diagram, chartConfiguration);

      workbook.write(outputStream);
      auditLogDataExport(chartConfiguration, diagram);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }

  private void addDetails(
      XSSFWorkbook workbook,
      AbstractAggregationResult aggregationResult,
      Diagram diagram,
      ChartConfiguration chartConfiguration) {
    Sheet detailsSheet = workbook.createSheet("Analysedetails");
    detailsSheet.setColumnWidth(0, FIRST_COLUMN_WIDTH);
    CellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setAlignment(HorizontalAlignment.LEFT);
    AtomicInteger rowCounter = new AtomicInteger(0);
    DataExportUtil.addMetadataBlock(
        detailsSheet,
        cellStyle,
        rowCounter,
        aggregationResult,
        diagram.getTitle(),
        diagram.getDescription(),
        diagram.getDiagramData().getEvaluatedDataAmount());
    addAttributesInformation(
        detailsSheet, cellStyle, rowCounter, chartConfiguration, aggregationResult);
  }

  private void addAttributesInformation(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      ChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration ->
          TwoAttributesChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, barChartConfiguration, aggregationResult);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          TwoAttributesChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, choroplethMapConfiguration, aggregationResult);
      case HistogramChartConfiguration histogramChartConfiguration ->
          HistogramChartDataExporter.addHistogramAttributesInformation(
              sheet, cellStyle, rowCounter, histogramChartConfiguration, aggregationResult);
      case PointBasedChartConfiguration pointBasedChartConfiguration ->
          PointBasedChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, pointBasedChartConfiguration, aggregationResult);
      case PieChartConfiguration pieChartConfiguration ->
          PieChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, pieChartConfiguration, aggregationResult);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(chartConfiguration));
    }
    rowCounter.incrementAndGet();
  }

  static String getAttributeName(
      AttributeSelection attributeSelection, AbstractAggregationResult aggregationResult) {
    return getAttributeName(attributeSelection, aggregationResult, true);
  }

  private static String getAttributeName(
      AttributeSelection attributeSelection,
      AbstractAggregationResult aggregationResult,
      boolean withUnit) {
    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(attributeSelection.getSearchKey(), aggregationResult);
    return DataExportUtil.getAttributeName(tableColumn, withUnit);
  }

  private void addDiagramData(
      XSSFWorkbook workbook, Diagram diagram, ChartConfiguration chartConfiguration) {
    Sheet dataSheet = workbook.createSheet("Daten");
    AtomicInteger rowCounter = new AtomicInteger(0);
    DiagramData diagramData = Hibernate.unproxy(diagram.getDiagramData(), DiagramData.class);
    switch (diagramData) {
      case BarChartData barChartData ->
          BarChartDataExporter.addData(
              dataSheet, rowCounter, barChartData, (BarChartConfiguration) chartConfiguration);
      case ChoroplethMapData choroplethMapData ->
          ChoroplethMapDataExporter.addData(
              dataSheet,
              rowCounter,
              choroplethMapData,
              (ChoroplethMapConfiguration) chartConfiguration);
      case HistogramChartData histogramChartData ->
          HistogramChartDataExporter.addData(
              dataSheet,
              rowCounter,
              histogramChartData,
              (HistogramChartConfiguration) chartConfiguration);
      case LineOrScatterChartData lineOrScatterChartData ->
          PointBasedChartDataExporter.addData(
              dataSheet,
              rowCounter,
              lineOrScatterChartData,
              (PointBasedChartConfiguration) chartConfiguration);
      case PieChartData pieChartData ->
          PieChartDataExporter.addData(dataSheet, rowCounter, pieChartData);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(diagramData));
    }
  }

  public static void addLegend(
      Sheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      AbstractAggregationResult aggregationResult,
      AttributeSelection attribute) {
    List<ValueToMeaning> valueToMeanings =
        AggregationResultUtil.getTableColumn(attribute.getSearchKey(), aggregationResult)
            .getValueToMeanings();
    if (CollectionUtils.isEmpty(valueToMeanings)) {
      return;
    }
    DataExportUtil.createMetadataCell(
        sheet.createRow(rowCounter.getAndIncrement()), cellStyle, 2, "Legende:");
    valueToMeanings.forEach(
        valueToMeaning -> {
          Row row = sheet.createRow(rowCounter.getAndIncrement());
          DataExportUtil.createMetadataCell(row, cellStyle, 2, valueToMeaning.getValue());
          DataExportUtil.createMetadataCell(row, cellStyle, 3, valueToMeaning.getMeaning());
        });
  }

  private void auditLogDataExport(ChartConfiguration chartConfiguration, Diagram diagram) {
    AuditLoggingData auditLoggingData = getAuditLoggingData(chartConfiguration, diagram);
    auditLogger.log(
        MODULE_NAME,
        "Export von Diagrammdaten",
        Map.of(
            "User-ID",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Diagrammtyp",
            auditLoggingData.diagramType,
            "Dargestellte Attribute",
            String.join(", ", auditLoggingData.attributeNames),
            "Anzahl dargestellter Datensätze",
            String.valueOf(auditLoggingData.evaluatedDataAmount)));
  }

  private AuditLoggingData getAuditLoggingData(
      ChartConfiguration chartConfiguration, Diagram diagram) {
    int evaluatedDataAmount = diagram.getDiagramData().getEvaluatedDataAmount();
    AbstractAggregationResult aggregationResult = diagram.getAnalysis().getAggregationResult();
    return switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration ->
          new AuditLoggingData(
              "Balkendiagramm",
              getAttributeNames(barChartConfiguration, aggregationResult),
              evaluatedDataAmount);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          new AuditLoggingData(
              "Choroplethenkarte",
              getAttributeNames(choroplethMapConfiguration, aggregationResult),
              evaluatedDataAmount);
      case HistogramChartConfiguration histogramChartConfiguration ->
          new AuditLoggingData(
              "Histogramm",
              getAttributeNames(histogramChartConfiguration, aggregationResult),
              evaluatedDataAmount);
      case LineChartConfiguration lineChartConfiguration ->
          new AuditLoggingData(
              "Liniendiagramm",
              getAttributeNames(lineChartConfiguration, aggregationResult),
              evaluatedDataAmount);
      case PieChartConfiguration pieChartConfiguration ->
          new AuditLoggingData(
              "Kreisdiagramm",
              List.of(
                  getAttributeName(
                      pieChartConfiguration.getAttributeSelection(), aggregationResult, false)),
              evaluatedDataAmount);
      case ScatterChartConfiguration scatterChartConfiguration ->
          new AuditLoggingData(
              "Streudiagramm",
              getAttributeNames(scatterChartConfiguration, aggregationResult),
              evaluatedDataAmount);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(chartConfiguration));
    };
  }

  private List<String> getAttributeNames(
      TwoAttributesChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    List<String> attributeNames = new ArrayList<>();
    attributeNames.add(
        getAttributeName(
            chartConfiguration.getPrimaryAttributeSelection(), aggregationResult, false));
    Optional.ofNullable(chartConfiguration.getSecondaryAttributeSelection())
        .ifPresent(
            secondaryAttribute ->
                attributeNames.add(getAttributeName(secondaryAttribute, aggregationResult, false)));

    return attributeNames;
  }

  private List<String> getAttributeNames(
      PointBasedChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    List<String> attributeNames = new ArrayList<>();
    attributeNames.add(
        getAttributeName(chartConfiguration.getXAttributeSelection(), aggregationResult, false));
    attributeNames.add(
        getAttributeName(chartConfiguration.getYAttributeSelection(), aggregationResult, false));
    Optional.ofNullable(chartConfiguration.getSecondaryAttributeSelection())
        .ifPresent(
            secondaryAttribute ->
                attributeNames.add(getAttributeName(secondaryAttribute, aggregationResult, false)));

    return attributeNames;
  }

  private record AuditLoggingData(
      String diagramType, List<String> attributeNames, int evaluatedDataAmount) {}
}
