/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static de.eshg.statistics.StatisticsApplication.MODULE_NAME;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.datatransfer.FilterInformationData;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
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

  @Transactional
  public Resource exportData(UUID diagramId) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);
    AbstractAggregationResult aggregationResult = diagram.getAnalysis().getAggregationResult();
    if (aggregationResult.getDataSensitivity().equals(StatisticsDataSensitivity.SENSITIVE)) {
      throw new BadRequestException(DataExportUtil.SENSITIVE_DATA_ERROR);
    }

    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      ChartConfiguration chartConfiguration =
          Hibernate.unproxy(
              diagram.getAnalysis().getChartConfiguration(), ChartConfiguration.class);

      CellStyleHolder cellStyleHolder = DataExportUtil.createCellStyles(workbook);

      addDetails(workbook, cellStyleHolder, aggregationResult, diagram, chartConfiguration);
      addDiagramData(workbook, cellStyleHolder, diagram, chartConfiguration);

      workbook.write(outputStream);
      auditLogDataExport(chartConfiguration, diagram);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }

  private void addDetails(
      XSSFWorkbook workbook,
      CellStyleHolder cellStyleHolder,
      AbstractAggregationResult aggregationResult,
      Diagram diagram,
      ChartConfiguration chartConfiguration) {
    Sheet detailsSheet = workbook.createSheet("Analysedetails");
    detailsSheet.setColumnWidth(0, FIRST_COLUMN_WIDTH);

    AtomicInteger rowCounter = new AtomicInteger(0);
    DataExportUtil.addMetadataBlock(
        detailsSheet,
        cellStyleHolder,
        rowCounter,
        aggregationResult,
        diagram.getTitle(),
        diagram.getDescription(),
        diagram.getDiagramData().getEvaluatedDataAmount());
    addAttributesInformation(
        detailsSheet, cellStyleHolder, rowCounter, chartConfiguration, aggregationResult);
    addFilterInformation(detailsSheet, cellStyleHolder, rowCounter, diagram);
  }

  private void addAttributesInformation(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      ChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration ->
          TwoAttributesChartDataExporter.addAttributesInformation(
              sheet, cellStyleHolder, rowCounter, barChartConfiguration, aggregationResult);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          TwoAttributesChartDataExporter.addAttributesInformation(
              sheet, cellStyleHolder, rowCounter, choroplethMapConfiguration, aggregationResult);
      case HistogramChartConfiguration histogramChartConfiguration ->
          HistogramChartDataExporter.addHistogramAttributesInformation(
              sheet, cellStyleHolder, rowCounter, histogramChartConfiguration, aggregationResult);
      case PointBasedChartConfiguration pointBasedChartConfiguration ->
          PointBasedChartDataExporter.addAttributesInformation(
              sheet, cellStyleHolder, rowCounter, pointBasedChartConfiguration, aggregationResult);
      case PieChartConfiguration pieChartConfiguration ->
          PieChartDataExporter.addAttributesInformation(
              sheet, cellStyleHolder, rowCounter, pieChartConfiguration, aggregationResult);
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
        AggregationResultUtil.getTableColumn(attributeSelection, aggregationResult);
    return DataExportUtil.getAttributeName(tableColumn, withUnit);
  }

  private void addFilterInformation(
      Sheet sheet, CellStyleHolder cellStyleHolder, AtomicInteger rowCounter, Diagram diagram) {
    List<TableColumn> tableColumns = diagram.getAnalysis().getAggregationResult().getTableColumns();
    if (!diagram.getFilters().isEmpty()) {
      DataExportUtil.createStringCell(
          sheet.createRow(rowCounter.getAndIncrement()), cellStyleHolder, 2, "Filter:");
    }
    diagram
        .getFilters()
        .forEach(
            filter -> {
              FilterInformationData filterInformationData =
                  FilterParameterMapper.mapToAttributeLabelWithFilterInformation(
                      Hibernate.unproxy(filter, AbstractFilterParameter.class), tableColumns);
              Row row = sheet.createRow(rowCounter.getAndIncrement());
              DataExportUtil.createStringCell(
                  row, cellStyleHolder, 2, filterInformationData.attributeLabel());
              DataExportUtil.createStringCell(
                  row, cellStyleHolder, 3, filterInformationData.filterInformation());
            });
  }

  private void addDiagramData(
      XSSFWorkbook workbook,
      CellStyleHolder cellStyleHolder,
      Diagram diagram,
      ChartConfiguration chartConfiguration) {
    Sheet dataSheet = workbook.createSheet("Daten");
    AtomicInteger rowCounter = new AtomicInteger(0);
    DiagramData diagramData = Hibernate.unproxy(diagram.getDiagramData(), DiagramData.class);
    switch (diagramData) {
      case BarChartData barChartData ->
          BarChartDataExporter.addData(
              dataSheet,
              cellStyleHolder,
              rowCounter,
              barChartData,
              (BarChartConfiguration) chartConfiguration);
      case ChoroplethMapData choroplethMapData ->
          ChoroplethMapDataExporter.addData(
              dataSheet,
              cellStyleHolder,
              rowCounter,
              choroplethMapData,
              (ChoroplethMapConfiguration) chartConfiguration);
      case HistogramChartData histogramChartData ->
          HistogramChartDataExporter.addData(
              dataSheet,
              cellStyleHolder,
              rowCounter,
              histogramChartData,
              (HistogramChartConfiguration) chartConfiguration);
      case LineOrScatterChartData lineOrScatterChartData ->
          PointBasedChartDataExporter.addData(
              dataSheet,
              cellStyleHolder,
              rowCounter,
              lineOrScatterChartData,
              (PointBasedChartConfiguration) chartConfiguration);
      case PieChartData pieChartData ->
          PieChartDataExporter.addData(dataSheet, cellStyleHolder, rowCounter, pieChartData);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(diagramData));
    }
  }

  public static void addLegend(
      Sheet sheet,
      CellStyleHolder cellStyleHolder,
      AtomicInteger rowCounter,
      AbstractAggregationResult aggregationResult,
      AttributeSelection attribute) {
    List<ValueToMeaning> valueToMeanings =
        AggregationResultUtil.getTableColumn(attribute, aggregationResult).getValueToMeanings();
    if (CollectionUtils.isEmpty(valueToMeanings)) {
      return;
    }
    DataExportUtil.createStringCell(
        sheet.createRow(rowCounter.getAndIncrement()), cellStyleHolder, 2, "Legende:");
    valueToMeanings.forEach(
        valueToMeaning -> {
          Row row = sheet.createRow(rowCounter.getAndIncrement());
          DataExportUtil.createStringCell(row, cellStyleHolder, 2, valueToMeaning.getValue());
          DataExportUtil.createStringCell(row, cellStyleHolder, 3, valueToMeaning.getMeaning());
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
