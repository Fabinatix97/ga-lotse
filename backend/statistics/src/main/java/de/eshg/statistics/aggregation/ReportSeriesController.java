/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.report.AbstractAddReportSeriesRequest;
import de.eshg.statistics.api.report.AddManualReportSeriesRequest;
import de.eshg.statistics.api.report.GetReportsRequest;
import de.eshg.statistics.api.report.GetReportsResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.api.report.UpdateReportSeriesRequest;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
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
  private final StatisticsFeatureToggle statisticsFeatureToggle;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final DiagramCreationService diagramCreationService;

  public ReportSeriesController(
      ReportSeriesService reportSeriesService,
      StatisticsFeatureToggle statisticsFeatureToggle,
      ModuleClientAuthenticator moduleClientAuthenticator,
      DiagramCreationService diagramCreationService) {
    this.reportSeriesService = reportSeriesService;
    this.statisticsFeatureToggle = statisticsFeatureToggle;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.diagramCreationService = diagramCreationService;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added report series")
  @Operation(summary = "Add a report series")
  public ReportSeriesDto addReportSeries(
      @RequestBody @Valid AbstractAddReportSeriesRequest addReportSeriesRequest) {
    statisticsFeatureToggle.assertNewFeatureIsEnabled(StatisticsFeature.REPORTS);

    ReportSeriesDto reportSeriesDto = reportSeriesService.addReportSeries(addReportSeriesRequest);
    UUID uuid = reportSeriesDto.id();
    if (addReportSeriesRequest instanceof AddManualReportSeriesRequest) {
      CompletableFuture.runAsync(
          () -> {
            ReportStateInformation stateInfo =
                reportSeriesService.getReportStateInformationManualSeries(uuid);
            while (stateInfo.state().equals(AggregationResultState.PENDING)) {
              AggregationResultPendingState pendingState = stateInfo.pendingState();
              moduleClientAuthenticator.doWithModuleClientAuthentication(
                  () -> {
                    switch (pendingState) {
                      case DATA_AGGREGATION ->
                          reportSeriesService.aggregateDataManualReportSeries(uuid);
                      case MIN_MAX_DETERMINATION ->
                          reportSeriesService.minMaxDeterminationManualReportSeries(uuid);
                      case EVALUATION_CONDUCTION ->
                          reportSeriesService.evaluationConductionManualReportSeries(uuid);
                      case COPY_ONGOING ->
                          throw new IllegalStateException(
                              "Report of series %s in copy ongoing state".formatted(uuid));
                      case DIAGRAM_CREATION -> {
                        Map<EvaluationDto, AddDiagramRequest> map =
                            reportSeriesService.findMissingDiagramOrCompleteManualReportSeries(
                                uuid);
                        if (!map.isEmpty()) {
                          Map.Entry<EvaluationDto, AddDiagramRequest> entry =
                              map.entrySet().iterator().next();
                          diagramCreationService.createDiagram(entry.getKey(), entry.getValue());
                        }
                      }
                    }
                  });
              stateInfo = reportSeriesService.getReportStateInformationManualSeries(uuid);
            }
          });
    }
    return reportSeriesDto;
  }

  @PatchExchange(value = "/{reportSeriesId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The patched report series")
  @Operation(summary = "Change title and description of a report series")
  public ReportSeriesDto updateReportSeries(
      @PathVariable(name = "reportSeriesId") UUID reportSeriesId,
      @RequestBody @Valid UpdateReportSeriesRequest updateReportSeriesRequest) {
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
