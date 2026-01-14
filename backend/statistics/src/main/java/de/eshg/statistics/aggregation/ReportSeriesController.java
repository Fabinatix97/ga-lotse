/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.UpdateReportSeriesRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
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
  private final EvaluationService evaluationService;
  private final ReportSeriesService reportSeriesService;
  private final StatisticsExecutorService statisticsExecutorService;
  private final ReportExecution reportExecution;
  private final ReportSeriesExecution reportSeriesExecution;

  public ReportSeriesController(
      EvaluationService evaluationService,
      ReportSeriesService reportSeriesService,
      StatisticsExecutorService statisticsExecutorService,
      ReportExecution reportExecution,
      ReportSeriesExecution reportSeriesExecution) {
    this.evaluationService = evaluationService;
    this.reportSeriesService = reportSeriesService;
    this.statisticsExecutorService = statisticsExecutorService;
    this.reportExecution = reportExecution;
    this.reportSeriesExecution = reportSeriesExecution;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added report series")
  @Operation(summary = "Add a report series")
  public ReportSeriesDto addReportSeries(
      @RequestBody @Valid AbstractAddReportSeriesRequest addReportSeriesRequest) {
    evaluationService.checkPermissionForEvaluation(addReportSeriesRequest.evaluationId());

    if (addReportSeriesRequest instanceof AddManualReportSeriesRequest) {
      ReportSeriesDto reportSeriesDto = reportSeriesService.addReportSeries(addReportSeriesRequest);
      statisticsExecutorService.submit(
          () -> reportExecution.completeReport(reportSeriesDto.reportInfos().getFirst().id()));
      return reportSeriesDto;
    } else {
      try {
        return reportSeriesService.addReportSeries(addReportSeriesRequest);
      } catch (DataIntegrityViolationException e) {
        if (reportSeriesService.hasActiveReportSeries(addReportSeriesRequest.evaluationId())) {
          String uniqueErrorMessage = "Only one active auto report series allowed";
          throw new BadRequestException(ErrorCode.CONFLICT, uniqueErrorMessage);
        } else {
          throw e;
        }
      }
    }
  }

  @PatchExchange(value = "/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched report series")
  @Operation(summary = "Change title and description of a report series")
  public ReportSeriesDto updateReportSeries(
      @PathVariable(name = "reportSeriesId") UUID reportSeriesId,
      @RequestBody @Valid UpdateReportSeriesRequest updateReportSeriesRequest) {
    return reportSeriesService.updateReportSeries(reportSeriesId, updateReportSeriesRequest);
  }

  @DeleteExchange(value = "/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the report series is deleted")
  @Operation(summary = "Delete a report series with the reports")
  public void deleteReportSeries(@PathVariable(name = "reportSeriesId") UUID reportSeriesId) {
    boolean isDeleted =
        reportSeriesService.deactivateAndDeleteOrFlagReportsForDeletion(reportSeriesId);
    if (!isDeleted) {
      statisticsExecutorService.submit(
          () -> reportSeriesExecution.deleteReportSeries(reportSeriesId));
    }
  }

  @PatchExchange(value = "/deactivate/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the report series is deactivated")
  @Operation(summary = "Deactivate a report series")
  public void deactivateReportSeries(@PathVariable(name = "reportSeriesId") UUID reportSeriesId) {
    reportSeriesService.deactivateOrDeleteReportSeries(reportSeriesId);
  }

  @PostExchange(value = "/overview", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Report overview page")
  @Operation(summary = "Get report series entries for the overview page")
  public GetReportsResponse getReportOverview(
      @RequestBody @Valid GetReportsRequest getReportsRequest) {
    return reportSeriesService.getReportSeriesEntriesForOverview(getReportsRequest);
  }
}
