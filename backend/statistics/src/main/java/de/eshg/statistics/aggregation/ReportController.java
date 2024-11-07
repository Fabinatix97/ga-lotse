/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.report.GetReportDetailPageResponse;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(BaseUrls.Statistics.REPORT_URL)
@Tag(name = "Report")
public class ReportController {
  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final ReportService reportService;
  private final ReportExecution reportExecution;
  private final StatisticExecutorService statisticExecutorService;

  public ReportController(
      StatisticsFeatureToggle statisticsFeatureToggle,
      ReportService reportService,
      ReportExecution reportExecution,
      StatisticExecutorService statisticExecutorService) {
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.reportService = reportService;
    this.reportExecution = reportExecution;
    this.statisticExecutorService = statisticExecutorService;
  }

  @GetExchange(value = "/{reportId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The information for the detail page")
  @Operation(summary = "Get the information for the detail page")
  public GetReportDetailPageResponse getReportDetailPage(
      @PathVariable(name = "reportId") UUID reportId) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);

    return reportService.getReportDetailPage(reportId);
  }

  @DeleteExchange(value = "/{reportId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the report is deleted")
  @Operation(summary = "Delete a report")
  public void deleteReport(@PathVariable(name = "reportId") UUID reportId) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    reportService.flagReportForDeletion(reportId);
    statisticExecutorService.submit(() -> reportExecution.deleteReport(reportId));
  }
}
