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
import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.mapper.AttributeSelectionMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineOrScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Hibernate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataExportService {
  private static final DateTimeFormatter dateTimeFormatter =
      DateTimeFormatter.ofPattern("dd.MM.yyyy").withZone(ZoneOffset.UTC);
  private static final String UNEXPECTED_VALUE = "Unexpected value: %s";
  static final int FIRST_COLUMN_WIDTH = 16 * 256;
  private final EvaluationService evaluationService;
  private final AuditLogger auditLogger;

  public DataExportService(EvaluationService evaluationService, AuditLogger auditLogger) {
    this.evaluationService = evaluationService;
    this.auditLogger = auditLogger;
  }

  @Transactional(readOnly = true)
  public Resource exportData(UUID diagramId) {
    Diagram diagram = evaluationService.getDiagramInternal(diagramId);
    AbstractAggregationResult aggregationResult =
        Hibernate.unproxy(
            diagram.getEvaluation().getAggregationResult(), AbstractAggregationResult.class);
    if (aggregationResult instanceof Statistic statistic && !statistic.isAnonymized()) {
      throw new BadRequestException("Data exports are only allowed for anonymized statistics");
    }

    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      AtomicInteger rowCounter = new AtomicInteger(0);
      XSSFSheet sheet = workbook.createSheet(diagram.getTitle());
      sheet.setColumnWidth(0, FIRST_COLUMN_WIDTH);

      ChartConfiguration chartConfiguration =
          Hibernate.unproxy(
              diagram.getEvaluation().getChartConfiguration(), ChartConfiguration.class);

      CellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setAlignment(HorizontalAlignment.LEFT);
      addMetadataBlock(sheet, cellStyle, rowCounter, diagram, chartConfiguration);
      addDiagramData(sheet, rowCounter, diagram, chartConfiguration);

      workbook.write(outputStream);
      auditLogDataExport(chartConfiguration, diagram);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }

  private void addMetadataBlock(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      Diagram diagram,
      ChartConfiguration chartConfiguration) {
    AbstractAggregationResult aggregationResult = diagram.getEvaluation().getAggregationResult();
    addMetadataRow(sheet, cellStyle, rowCounter.getAndIncrement(), "Name", diagram.getTitle());
    addMetadataRow(
        sheet, cellStyle, rowCounter.getAndIncrement(), "Beschreibung", diagram.getDescription());
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Zeitraum",
        "%s - %s"
            .formatted(
                dateTimeFormatter.format(aggregationResult.getTimeRangeStart()),
                dateTimeFormatter.format(aggregationResult.getTimeRangeEnd())));
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Erstellt am",
        dateTimeFormatter.format(aggregationResult.getCreatedAt()));
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Datensätze gesamt",
        aggregationResult.getNumberOfTableRows());
    addMetadataRow(
        sheet,
        cellStyle,
        rowCounter.getAndIncrement(),
        "Datensätze ausgewertet",
        diagram.getDiagramData().getEvaluatedDataAmount());
    addAttributesInformation(sheet, cellStyle, rowCounter, chartConfiguration, aggregationResult);
  }

  static void addMetadataRow(
      XSSFSheet sheet, CellStyle cellStyle, int rowNumber, String label, String value) {
    XSSFRow row = sheet.createRow(rowNumber);
    createMetadataCell(row, cellStyle, 0, label);
    createMetadataCell(row, cellStyle, 2, value);
    addMergedRegion(sheet, rowNumber);
  }

  static void addMetadataRow(
      XSSFSheet sheet, CellStyle cellStyle, int rowNumber, String label, double value) {
    XSSFRow row = sheet.createRow(rowNumber);
    createMetadataCell(row, cellStyle, 0, label);
    createMetadataCell(row, cellStyle, value);
    addMergedRegion(sheet, rowNumber);
  }

  private static void createMetadataCell(
      XSSFRow row, CellStyle cellStyle, int columnIndex, String value) {
    XSSFCell cell = row.createCell(columnIndex, CellType.STRING);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }

  private static void createMetadataCell(XSSFRow row, CellStyle cellStyle, double value) {
    XSSFCell cell = row.createCell(2, CellType.NUMERIC);
    cell.setCellValue(value);
    cell.setCellStyle(cellStyle);
  }

  private static void addMergedRegion(XSSFSheet sheet, int rowNumber) {
    sheet.addMergedRegion(new CellRangeAddress(rowNumber, rowNumber, 0, 1));
    sheet.addMergedRegion(new CellRangeAddress(rowNumber, rowNumber, 2, 7));
  }

  private void addAttributesInformation(
      XSSFSheet sheet,
      CellStyle cellStyle,
      AtomicInteger rowCounter,
      ChartConfiguration chartConfiguration,
      AbstractAggregationResult aggregationResult) {
    switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration ->
          BarChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, barChartConfiguration, aggregationResult);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          ChoroplethMapDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, choroplethMapConfiguration, aggregationResult);
      case HistogramChartConfiguration histogramChartConfiguration ->
          HistogramChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, histogramChartConfiguration, aggregationResult);
      case LineOrScatterChartConfiguration lineOrScatterChartConfiguration ->
          PointBasedChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, lineOrScatterChartConfiguration, aggregationResult);
      case PieChartConfiguration pieChartConfiguration ->
          PieChartDataExporter.addAttributesInformation(
              sheet, cellStyle, rowCounter, pieChartConfiguration, aggregationResult);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(chartConfiguration));
    }
    rowCounter.incrementAndGet();
  }

  static Optional<String> getAttributeName(
      AttributeSelection attributeSelection, AbstractAggregationResult aggregationResult) {
    return getAttributeName(attributeSelection, aggregationResult, true);
  }

  static Optional<String> getAttributeName(
      AttributeSelection attributeSelection,
      AbstractAggregationResult aggregationResult,
      boolean withUnit) {
    if (attributeSelection == null || aggregationResult == null) {
      return Optional.empty();
    }

    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(
            AttributeSelectionMapper.mapToApi(attributeSelection, true), aggregationResult);

    StringBuilder sb = new StringBuilder(tableColumn.getBusinessModuleAttributeName());
    if (tableColumn.getBaseModuleAttributeName() != null) {
      sb.append(":");
      sb.append(tableColumn.getBaseModuleAttributeName());
    }

    if (withUnit && tableColumn.getUnit() != null) {
      sb.append(" in ");
      sb.append(tableColumn.getUnit());
    }

    return Optional.of(sb.toString());
  }

  private void addDiagramData(
      XSSFSheet sheet,
      AtomicInteger rowCounter,
      Diagram diagram,
      ChartConfiguration chartConfiguration) {
    DiagramData diagramData = Hibernate.unproxy(diagram.getDiagramData(), DiagramData.class);
    switch (diagramData) {
      case BarChartData barChartData ->
          BarChartDataExporter.addData(
              sheet, rowCounter, barChartData, (BarChartConfiguration) chartConfiguration);
      case ChoroplethMapData choroplethMapData ->
          ChoroplethMapDataExporter.addData(
              sheet,
              rowCounter,
              choroplethMapData,
              (ChoroplethMapConfiguration) chartConfiguration);
      case HistogramChartData histogramChartData ->
          HistogramChartDataExporter.addData(
              sheet,
              rowCounter,
              histogramChartData,
              (HistogramChartConfiguration) chartConfiguration);
      case LineOrScatterChartData lineOrScatterChartData ->
          PointBasedChartDataExporter.addData(
              sheet,
              rowCounter,
              lineOrScatterChartData,
              (LineOrScatterChartConfiguration) chartConfiguration);
      case PieChartData pieChartData ->
          PieChartDataExporter.addData(sheet, rowCounter, pieChartData);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(diagramData));
    }
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
    AbstractAggregationResult aggregationResult = diagram.getEvaluation().getAggregationResult();
    List<String> attributeNames = new ArrayList<>();
    return switch (chartConfiguration) {
      case BarChartConfiguration barChartConfiguration -> {
        getAttributeName(
                barChartConfiguration.getPrimaryAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                barChartConfiguration.getSecondaryAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Balkendiagramm", attributeNames, evaluatedDataAmount);
      }
      case ChoroplethMapConfiguration choroplethMapConfiguration -> {
        getAttributeName(
                choroplethMapConfiguration.getPrimaryAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                choroplethMapConfiguration.getSecondaryAttributeSelection(),
                aggregationResult,
                false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Choroplethenkarte", attributeNames, evaluatedDataAmount);
      }
      case HistogramChartConfiguration histogramChartConfiguration -> {
        getAttributeName(
                histogramChartConfiguration.getPrimaryAttributeSelection(),
                aggregationResult,
                false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                histogramChartConfiguration.getSecondaryAttributeSelection(),
                aggregationResult,
                false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Histogramm", attributeNames, evaluatedDataAmount);
      }
      case LineChartConfiguration lineChartConfiguration -> {
        getAttributeName(lineChartConfiguration.getXAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(lineChartConfiguration.getYAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                lineChartConfiguration.getSecondaryAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Liniendiagramm", attributeNames, evaluatedDataAmount);
      }
      case PieChartConfiguration pieChartConfiguration -> {
        getAttributeName(pieChartConfiguration.getAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Kreisdiagramm", attributeNames, evaluatedDataAmount);
      }
      case ScatterChartConfiguration scatterChartConfiguration -> {
        getAttributeName(
                scatterChartConfiguration.getXAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                scatterChartConfiguration.getYAttributeSelection(), aggregationResult, false)
            .ifPresent(attributeNames::add);
        getAttributeName(
                scatterChartConfiguration.getSecondaryAttributeSelection(),
                aggregationResult,
                false)
            .ifPresent(attributeNames::add);
        yield new AuditLoggingData("Streudiagramm", attributeNames, evaluatedDataAmount);
      }
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(chartConfiguration));
    };
  }

  private record AuditLoggingData(
      String diagramType, List<String> attributeNames, int evaluatedDataAmount) {}
}
