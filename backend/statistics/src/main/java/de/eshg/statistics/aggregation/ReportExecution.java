/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReportExecution {
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final ReportService reportService;
  private final DiagramCreationService diagramCreationService;

  private static final Logger log = LoggerFactory.getLogger(ReportExecution.class);

  public ReportExecution(
      ModuleClientAuthenticator moduleClientAuthenticator,
      ReportService reportService,
      DiagramCreationService diagramCreationService) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.reportService = reportService;
    this.diagramCreationService = diagramCreationService;
  }

  @Scheduled(cron = "${de.eshg.statistics.auto-report.schedule:@daily}")
  public void handlePlannedReports() {
    UUID reportId = reportService.getPlannedReportToExecuteSetToPending();
    while (reportId != null) {
      createNewPlannedReport(reportId);
      completeReport(reportId);
      UUID nextReportId = reportService.getPlannedReportToExecuteSetToPending();
      if (reportId.equals(nextReportId)) {
        // prevent endless loop
        reportId = null;
      } else {
        reportId = nextReportId;
      }
    }
  }

  private void createNewPlannedReport(UUID reportId) {
    try {
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> reportService.createNewPlannedReportInSeries(reportId));
    } catch (Exception e) {
      log.error("Could not complete report {}", reportId, e);
      setToFailed(reportId);
    }
  }

  public void completeReport(UUID reportId) {
    try {
      ReportStateInformation stateInfo = reportService.getReportStateInformation(reportId);
      while (stateInfo.state().equals(AggregationResultState.PENDING)) {
        AggregationResultPendingState pendingState = stateInfo.pendingState();
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> {
              switch (pendingState) {
                case DATA_AGGREGATION -> reportService.aggregateData(reportId);
                case MIN_MAX_DETERMINATION -> reportService.minMaxDetermination(reportId);
                case EVALUATION_CONDUCTION -> reportService.evaluationConduction(reportId);
                case COPY_ONGOING ->
                    throw new IllegalStateException(
                        "Report of series %s in copy ongoing state".formatted(reportId));
                case DIAGRAM_CREATION -> {
                  Map<EvaluationDto, AddDiagramRequest> map =
                      reportService.findMissingDiagramOrCompleteAutoReport(reportId);
                  if (!map.isEmpty()) {
                    Map.Entry<EvaluationDto, AddDiagramRequest> entry =
                        map.entrySet().iterator().next();
                    diagramCreationService.createDiagram(entry.getKey(), entry.getValue());
                  }
                }
              }
            });
        stateInfo = reportService.getReportStateInformation(reportId);
      }
    } catch (Exception e) {
      log.error("Could not complete report {}", reportId, e);
      setToFailed(reportId);
    }
  }

  private void setToFailed(UUID reportId) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> reportService.setStateToFailed(reportId));
  }
}
