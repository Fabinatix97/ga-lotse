/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.TABLE_ROWS_REMOVAL;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.statistics.exception.IncompleteDeletionException;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EvaluationExecution {
  private static final Logger log = LoggerFactory.getLogger(EvaluationExecution.class);

  private final DiagramCreationService diagramCreationService;
  private final AnalysisService analysisService;
  private final EvaluationService evaluationService;
  private final EvaluationCopyService evaluationCopyService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final ReportSeriesExecution reportSeriesExecution;

  public EvaluationExecution(
      DiagramCreationService diagramCreationService,
      AnalysisService analysisService,
      EvaluationService evaluationService,
      EvaluationCopyService evaluationCopyService,
      ModuleClientAuthenticator moduleClientAuthenticator,
      ReportSeriesExecution reportSeriesExecution) {
    this.diagramCreationService = diagramCreationService;
    this.analysisService = analysisService;
    this.evaluationService = evaluationService;
    this.evaluationCopyService = evaluationCopyService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.reportSeriesExecution = reportSeriesExecution;
  }

  public void addEvaluation(UUID evaluationId) {
    try {
      boolean dataNeedsAnonymization =
          moduleClientAuthenticator.doWithModuleClientAuthentication(
              () -> evaluationService.getDataNeedsAnonymization(evaluationId));
      while (evaluationService
          .getAggregationResultState(evaluationId)
          .equals(AggregationResultState.CREATING)) {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> workOnEvaluation(evaluationId, dataNeedsAnonymization));
      }
    } catch (Exception e) {
      log.error("Could not complete evaluation", e);
      setState(evaluationId, AggregationResultState.FAILED);
    }
  }

  private void workOnEvaluation(UUID evaluationId, boolean dataNeedsAnonymization) {
    AggregationResultStateInformation stateInformation =
        evaluationService.getStateInformation(evaluationId);

    switch (stateInformation.pendingState()) {
      case DATA_AGGREGATION ->
          evaluationService.aggregateData(evaluationId, dataNeedsAnonymization);
      case MIN_MAX_DETERMINATION -> evaluationService.minMaxDetermination(evaluationId);
      case ANALYSIS_CONDUCTION -> analysisService.analysisConduction(evaluationId);
      case DIAGRAM_CREATION -> diagramCreationService.diagramRecreation(evaluationId);
      default -> {
        // ignore
      }
    }
  }

  private void setState(UUID evaluationId, AggregationResultState state) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> evaluationService.setState(evaluationId, state));
  }

  public void updateEvaluation(UUID evaluationId) {
    try {
      removeEvaluationData(evaluationId, AggregationResultPendingState.DATA_AGGREGATION);
      updateEvaluationData(evaluationId);
    } catch (Exception e) {
      log.error("Could not update evaluation", e);
      setState(evaluationId, AggregationResultState.FAILED);
    }
  }

  private void removeEvaluationData(
      UUID evaluationId, AggregationResultPendingState pendingStateAfterRemoval) {
    while (TABLE_ROWS_REMOVAL.equals(
        evaluationService.getAggregationResultPendingState(evaluationId))) {
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> evaluationService.removeTableRows(evaluationId, pendingStateAfterRemoval));
    }
  }

  private void updateEvaluationData(UUID evaluationId) {
    boolean dataNeedsAnonymization =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> evaluationService.getDataNeedsAnonymization(evaluationId));
    while (evaluationService
        .getAggregationResultState(evaluationId)
        .equals(AggregationResultState.UPDATING)) {
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> workOnEvaluation(evaluationId, dataNeedsAnonymization));
    }
  }

  public void cloneEvaluation(UUID originalId, UUID copyId) {
    try {
      while (evaluationService
          .getAggregationResultState(originalId)
          .equals(AggregationResultState.COPY_ONGOING)) {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> evaluationCopyService.workOnCopy(originalId, copyId));
      }
    } catch (Exception e) {
      log.error("Could not complete cloning evaluation", e);
      setState(originalId, AggregationResultState.COMPLETED);
      setState(copyId, AggregationResultState.FAILED);
    }
  }

  public void deleteEvaluation(UUID evaluationId) {
    try {
      deleteAllReportSeries(evaluationId);
      removeEvaluationData(evaluationId, null);
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> evaluationService.deleteEvaluation(evaluationId));
    } catch (Exception e) {
      log.error("Could not delete evaluation {}", evaluationId, e);
      setFailed(evaluationId);
    }
  }

  private void deleteAllReportSeries(UUID evaluationId) {
    Set<UUID> ids = evaluationService.getReportSeriesIdsOfEvaluation(evaluationId);
    ids.forEach(
        id -> {
          if (!reportSeriesExecution.deleteReportSeries(id)) {
            throw new IncompleteDeletionException();
          }
        });
  }

  private void setFailed(UUID evaluationId) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> evaluationService.setStateToFailed(evaluationId));
  }
}
