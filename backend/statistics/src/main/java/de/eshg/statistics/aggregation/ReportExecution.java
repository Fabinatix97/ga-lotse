/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReportExecution {
  private static final Logger log = LoggerFactory.getLogger(ReportExecution.class);

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final ReportService reportService;
  private final DiagramCreationService diagramCreationService;

  public ReportExecution(
      ModuleClientAuthenticator moduleClientAuthenticator,
      ReportService reportService,
      DiagramCreationService diagramCreationService) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.reportService = reportService;
    this.diagramCreationService = diagramCreationService;
  }

  @Scheduled(cron = "${de.eshg.statistics.auto-report.schedule:@hourly}")
  @SchedulerLock(name = "HandlePlannedReports")
  public void handlePlannedReports() {
    LockAssert.assertLocked();
    log.info("Starting job 'HandlePlannedReports'");
    handlePlannedReportsInternal();
  }

  public void handlePlannedReportsInternal() {
    long start = System.currentTimeMillis();
    long maxJobDurationInMinutes = 50;
    UUID reportId = reportService.getPlannedReportToExecuteSetToPending();
    while (reportId != null) {
      createNewPlannedReport(reportId);
      completeReport(reportId);

      if (((System.currentTimeMillis() - start) / (1000 * 60)) > maxJobDurationInMinutes) {
        break;
      }

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
      boolean dataNeedsAnonymization =
          moduleClientAuthenticator.doWithModuleClientAuthentication(
              () -> reportService.getDataNeedsAnonymization(reportId));
      AggregationResultStateInformation stateInfo = reportService.getStateInformation(reportId);
      while (stateInfo.state().equals(AggregationResultState.CREATING)) {
        AggregationResultPendingState pendingState = stateInfo.pendingState();
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> {
              switch (pendingState) {
                case DATA_AGGREGATION ->
                    reportService.aggregateData(reportId, dataNeedsAnonymization);
                case MIN_MAX_DETERMINATION -> reportService.minMaxDetermination(reportId);
                case ANALYSIS_CONDUCTION -> reportService.analysisConduction(reportId);
                case DIAGRAM_CREATION -> {
                  Map<AnalysisDto, AddDiagramRequest> map =
                      reportService.findMissingDiagramOrCompleteAutoReport(reportId);
                  if (!map.isEmpty()) {
                    Map.Entry<AnalysisDto, AddDiagramRequest> entry =
                        map.entrySet().iterator().next();
                    diagramCreationService.createDiagram(entry.getKey(), entry.getValue());
                  }
                }
                default ->
                    throw new IllegalStateException(
                        "Report of series %s in illegal state: %s"
                            .formatted(reportId, pendingState));
              }
            });
        stateInfo = reportService.getStateInformation(reportId);
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

  public boolean deleteReport(UUID reportId) {
    AtomicBoolean deletionFinished = new AtomicBoolean(false);
    try {
      while (!deletionFinished.get()) {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> deletionFinished.set(reportService.deleteReport(reportId)));
      }
    } catch (Exception e) {
      log.error("Could not delete report {}", reportId, e);
      setToFailed(reportId);
    }
    return deletionFinished.get();
  }
}
