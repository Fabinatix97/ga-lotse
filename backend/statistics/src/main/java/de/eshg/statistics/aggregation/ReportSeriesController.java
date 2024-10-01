/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AbstractUpdateReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(BaseUrls.Statistics.REPORT_SERIES_URL)
@Tag(name = "ReportSeries")
public class ReportSeriesController {
  private final ReportSeriesService reportSeriesService;
  private final ReportExecution reportExecution;
  private final StatisticsFeatureToggle statisticsFeatureToggle;

  public ReportSeriesController(
      ReportSeriesService reportSeriesService,
      ReportExecution reportExecution,
      StatisticsFeatureToggle statisticsFeatureToggle) {
    this.reportSeriesService = reportSeriesService;
    this.reportExecution = reportExecution;
    this.statisticsFeatureToggle = statisticsFeatureToggle;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added report series")
  @Operation(summary = "Add a report series")
  public ReportSeriesDto addReportSeries(
      @RequestBody @Valid AbstractAddReportSeriesRequest addReportSeriesRequest) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);

    ReportSeriesDto reportSeriesDto = reportSeriesService.addReportSeries(addReportSeriesRequest);
    if (addReportSeriesRequest instanceof AddManualReportSeriesRequest) {
      CompletableFuture.runAsync(
          () -> reportExecution.completeReport(reportSeriesDto.reportInfos().getFirst().id()));
    }
    return reportSeriesDto;
  }

  @PatchExchange(value = "/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched report series")
  @Operation(summary = "Change title and description of a report series or change activation")
  public ReportSeriesDto updateReportSeries(
      @PathVariable(name = "reportSeriesId") UUID reportSeriesId,
      @RequestBody @Valid AbstractUpdateReportSeriesRequest updateReportSeriesRequest) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    return reportSeriesService.updateReportSeries(reportSeriesId, updateReportSeriesRequest);
  }

  @DeleteExchange(value = "/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the report series is deleted")
  @Operation(summary = "Delete a report series with the reports")
  public void deleteReportSeries(@PathVariable(name = "reportSeriesId") UUID reportSeriesId) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    reportSeriesService.deleteReportSeries(reportSeriesId);
  }

  @PostExchange(value = "/overview", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Report overview page")
  @Operation(summary = "Get report series entries for the overview page")
  public GetReportsResponse getReportOverview(
      @RequestBody @Valid GetReportsRequest getReportsRequest) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);
    return reportSeriesService.getReportSeriesEntriesForOverview(getReportsRequest);
  }
}
