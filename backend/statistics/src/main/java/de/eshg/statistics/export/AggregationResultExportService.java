/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static de.eshg.statistics.StatisticsApplication.MODULE_NAME;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.aggregation.AbstractAggregationResultService;
import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.aggregation.ReportService;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AggregationResultExportService {
  private final AuditLogger auditLogger;

  public AggregationResultExportService(AuditLogger auditLogger) {
    this.auditLogger = auditLogger;
  }

  @Transactional
  public void checkExportAllowedEvaluation(UUID evaluationId, EvaluationService evaluationService) {
    evaluationService.checkPermissionForEvaluation(evaluationId);
    Evaluation evaluation = evaluationService.getEvaluationInternal(evaluationId);
    if (evaluation.getDataSensitivity().equals(StatisticsDataSensitivity.SENSITIVE)) {
      throw new BadRequestException(DataExportUtil.SENSITIVE_DATA_ERROR);
    }
    EvaluationService.validateEvaluationCompleted(evaluation);
    if (Boolean.TRUE.equals(
        AbstractAggregationResultService.isTooMuchDataForExportFunction().apply(evaluation))) {
      throw new BadRequestException("The evaluation has too much data to be exported");
    }
  }

  @Transactional
  public void checkExportAllowedReport(UUID reportId, ReportService reportService) {
    Report report = reportService.getReportInternal(reportId);
    ReportService.validateReportCompleted(report);
    if (Boolean.TRUE.equals(
        AbstractAggregationResultService.isTooMuchDataForExportFunction().apply(report))) {
      throw new BadRequestException("The report has too much data to be exported");
    }
  }

  @Transactional
  public long countTableRows(
      UUID aggregationResultId, AbstractAggregationResultService aggregationResultService) {
    AbstractAggregationResult aggregationResult =
        aggregationResultService.getAbstractAggregationResultInternal(aggregationResultId);
    return aggregationResultService.countTableRows(aggregationResult);
  }

  @Transactional(readOnly = true)
  public void addAggregationResultInformation(
      UUID id, AbstractAggregationResultService service, Sheet sheet, CellStyle cellStyle) {
    AbstractAggregationResult aggregationResult = service.getAbstractAggregationResultInternal(id);
    String name = getAggregationResultName(aggregationResult);
    String description = getAggregationResultDescription(aggregationResult);
    AtomicInteger rowCounter = new AtomicInteger(0);
    DataExportUtil.addMetadataBlock(
        sheet, cellStyle, rowCounter, aggregationResult, name, description, null);
    rowCounter.getAndIncrement();
    Row legendRow = sheet.createRow(rowCounter.getAndIncrement());
    DataExportUtil.createMetadataCell(legendRow, cellStyle, 1, "Legende:");
    DataExportUtil.createMetadataCell(legendRow, cellStyle, 3, "Wert");
    DataExportUtil.createMetadataCell(legendRow, cellStyle, 4, "Bedeutung");
    DataExportUtil.createMetadataCell(legendRow, cellStyle, 5, "Info");
    aggregationResult.getTableColumns().stream()
        .filter(
            tableColumn ->
                isRelevantTableColumn(tableColumn) && !tableColumn.getValueToMeanings().isEmpty())
        .forEach(tableColumn -> addLegendForTableColumn(tableColumn, rowCounter, sheet, cellStyle));
  }

  private static String getAggregationResultName(AbstractAggregationResult aggregationResult) {
    String name = aggregationResult.getName();
    if (aggregationResult instanceof Report report) {
      ReportSeries reportSeries = report.getReportSeries();
      if (reportSeries.getReportType().equals(ReportType.AUTO)) {
        name = "%s - #%s".formatted(reportSeries.getName(), report.getName());
      }
    }
    return name;
  }

  private String getAggregationResultDescription(AbstractAggregationResult aggregationResult) {
    if (aggregationResult instanceof Report report) {
      return report.getReportSeries().getDescription();
    } else {
      return null;
    }
  }

  private static boolean isRelevantTableColumn(TableColumn tableColumn) {
    return !tableColumn.getValueType().equals(TableColumnValueType.PROCEDURE_REFERENCE);
  }

  private static void addLegendForTableColumn(
      TableColumn tableColumn, AtomicInteger rowCounter, Sheet sheet, CellStyle cellStyle) {
    DataExportUtil.createMetadataCell(
        sheet.createRow(rowCounter.getAndIncrement()),
        cellStyle,
        2,
        DataExportUtil.getAttributeName(tableColumn, true));
    tableColumn
        .getValueToMeanings()
        .forEach(
            valueToMeaning -> {
              Row row = sheet.createRow(rowCounter.getAndIncrement());
              DataExportUtil.createMetadataCell(row, cellStyle, 3, valueToMeaning.getValue());
              DataExportUtil.createMetadataCell(row, cellStyle, 4, valueToMeaning.getMeaning());
              if (valueToMeaning.isUnknownValue()) {
                DataExportUtil.createMetadataCell(row, cellStyle, 5, "unbekannter Wert");
              }
            });
  }

  @Transactional(readOnly = true)
  public Map<Integer, CellType> addAggregationResultDataHeaderAndReturnCellTypes(
      UUID id, AbstractAggregationResultService service, Sheet sheet, CellStyle cellStyle) {
    Map<Integer, CellType> cellTypeMap = new HashMap<>();

    AbstractAggregationResult aggregationResult = service.getAbstractAggregationResultInternal(id);
    List<TableColumn> tableColumns = aggregationResult.getTableColumns();

    Row headerRow = sheet.createRow(0);
    AtomicInteger cellCounter = new AtomicInteger(0);
    IntStream.range(0, tableColumns.size())
        .filter(index -> isRelevantTableColumn(tableColumns.get(index)))
        .boxed()
        .forEach(
            index -> {
              TableColumn tableColumn = tableColumns.get(index);
              cellTypeMap.put(index, getCellType(tableColumn.getValueType()));
              Cell cell = headerRow.createCell(cellCounter.getAndIncrement(), CellType.STRING);
              cell.setCellValue(DataExportUtil.getAttributeName(tableColumn, true));
              cell.setCellStyle(cellStyle);
            });
    return cellTypeMap;
  }

  private CellType getCellType(TableColumnValueType valueType) {
    return switch (valueType) {
      case BOOLEAN -> CellType.BOOLEAN;
      case DATE, TEXT, VALUE_WITH_OPTIONS -> CellType.STRING;
      case DECIMAL, INTEGER -> CellType.NUMERIC;
      default -> throw new IllegalArgumentException("Unexpected type %s".formatted(valueType));
    };
  }

  @Transactional(readOnly = true)
  public int addAggregationResultRows(
      UUID id,
      int page,
      AbstractAggregationResultService service,
      Map<Integer, CellType> columnToCellTypes,
      Sheet sheet,
      AtomicInteger rowCounter,
      CellStyle cellStyle) {
    AbstractAggregationResult aggregationResult = service.getAbstractAggregationResultInternal(id);
    Page<TableRow> tableRowPage = service.getTableRowPage(aggregationResult, page);

    if (tableRowPage.isEmpty()) {
      throw new IllegalStateException(
          "Change of number of data rows during export for %s".formatted(id));
    }

    tableRowPage
        .get()
        .forEach(
            tableRow -> {
              Row row = sheet.createRow(rowCounter.getAndIncrement());
              AtomicInteger cellCounter = new AtomicInteger(0);
              IntStream.range(0, tableRow.getCellEntries().size())
                  .boxed()
                  .filter(index -> columnToCellTypes.get(index) != null)
                  .forEach(
                      index -> {
                        Cell cell =
                            row.createCell(
                                cellCounter.getAndIncrement(), columnToCellTypes.get(index));
                        cell.setCellStyle(cellStyle);
                        Object value = tableRow.getCellEntries().get(index).getValue();
                        switch (value) {
                          case null -> {
                            // nothing to write
                          }
                          case Boolean valueBoolean -> cell.setCellValue(valueBoolean);
                          case Double valueDouble -> cell.setCellValue(valueDouble);
                          case Integer valueInteger -> cell.setCellValue(valueInteger);
                          case String valueString -> cell.setCellValue(valueString);
                          default ->
                              throw new IllegalArgumentException(
                                  "Unexpected value type %s in data row %s of %s"
                                      .formatted(value.getClass(), index, id));
                        }
                      });
            });

    return tableRowPage.getSize();
  }

  @Transactional(readOnly = true)
  public void auditLogAggregationResultDataExport(
      UUID id, AbstractAggregationResultService service, String function) {
    AbstractAggregationResult aggregationResult = service.getAbstractAggregationResultInternal(id);
    auditLogger.log(
        MODULE_NAME,
        function,
        Map.of(
            "User-ID",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Name",
            getAggregationResultName(aggregationResult),
            "Anzahl Datensätze",
            String.valueOf(aggregationResult.getNumberOfTableRows())));
  }
}
