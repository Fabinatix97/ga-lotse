/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.aggregation.AbstractAggregationResultService;
import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.aggregation.ReportService;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(BaseUrls.Statistics.DATA_EXPORT_CONTROLLER)
@Tag(name = "DataExport")
public class DataExportController {
  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final DiagramExportService diagramExportService;
  private final AggregationResultExportService aggregationResultExportService;
  private final EvaluationService evaluationService;
  private final ReportService reportService;

  public DataExportController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      DiagramExportService diagramExportService,
      AggregationResultExportService aggregationResultExportService,
      EvaluationService evaluationService,
      ReportService reportService) {
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.diagramExportService = diagramExportService;
    this.aggregationResultExportService = aggregationResultExportService;
    this.evaluationService = evaluationService;
    this.reportService = reportService;
  }

  @GetExchange(value = "/diagram/{diagramId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Exported diagram data")
  @Operation(summary = "Export diagram data")
  public ResponseEntity<Resource> exportDiagramData(
      @PathVariable(name = "diagramId") UUID diagramId) {
    diagramExportService.checkExportAllowed(diagramId);
    return getResponseEntity(
        "diagramm-daten-export.xlsx", diagramExportService.exportData(diagramId));
  }

  private ResponseEntity<Resource> getResponseEntity(String filename, Resource resource) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment().filename(filename).build().toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.APPLICATION_XLSX_VALUE)
        .body(resource);
  }

  @GetExchange(value = "/evaluation/{evaluationId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Exported evaluation raw data")
  @Operation(summary = "Export evaluation data")
  public ResponseEntity<Resource> exportEvaluationData(
      @PathVariable(name = "evaluationId") UUID evaluationId) {
    aggregationResultExportService.checkExportAllowedEvaluation(evaluationId, evaluationService);
    return getResponseEntity(
        "auswertung-daten-export.xlsx",
        exportAggregationResult(evaluationId, evaluationService, "Export einer Auswertung"));
  }

  @GetExchange(value = "/report/{reportId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Exported report raw data")
  @Operation(summary = "Export report data")
  public ResponseEntity<Resource> exportReportData(@PathVariable(name = "reportId") UUID reportId) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    aggregationResultExportService.checkExportAllowedReport(reportId, reportService);
    return getResponseEntity(
        "report-daten-export.xlsx",
        exportAggregationResult(reportId, reportService, "Export eines Reports"));
  }

  private Resource exportAggregationResult(
      UUID id, AbstractAggregationResultService service, String auditLogFunction) {
    long totalElements = aggregationResultExportService.countTableRows(id, service);

    try (SXSSFWorkbook workbook = new SXSSFWorkbook(100);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      CellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setAlignment(HorizontalAlignment.LEFT);

      aggregationResultExportService.addAggregationResultInformation(
          id, service, workbook.createSheet("Information"), cellStyle);

      Sheet sheet = workbook.createSheet("Daten");
      Map<Integer, CellType> cellTypeMap =
          aggregationResultExportService.addAggregationResultDataHeaderAndReturnCellTypes(
              id, service, sheet, cellStyle);
      long exportedRows = 0;
      int currentPage = 0;
      AtomicInteger rowCounter = new AtomicInteger(1);
      while (exportedRows < totalElements) {
        exportedRows +=
            aggregationResultExportService.addAggregationResultRows(
                id, currentPage, service, cellTypeMap, sheet, rowCounter, cellStyle);
        currentPage++;
      }

      workbook.write(outputStream);
      aggregationResultExportService.auditLogAggregationResultDataExport(
          id, service, auditLogFunction);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }
}
