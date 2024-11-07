/*
 * Copyright 2024 cronn GmbH
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
public class StatisticExecution {
  private static final Logger log = LoggerFactory.getLogger(StatisticExecution.class);

  private final DiagramCreationService diagramCreationService;
  private final EvaluationService evaluationService;
  private final StatisticService statisticService;
  private final StatisticCopyService statisticCopyService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final ReportSeriesExecution reportSeriesExecution;

  public StatisticExecution(
      DiagramCreationService diagramCreationService,
      EvaluationService evaluationService,
      StatisticService statisticService,
      StatisticCopyService statisticCopyService,
      ModuleClientAuthenticator moduleClientAuthenticator,
      ReportSeriesExecution reportSeriesExecution) {
    this.diagramCreationService = diagramCreationService;
    this.evaluationService = evaluationService;
    this.statisticService = statisticService;
    this.statisticCopyService = statisticCopyService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.reportSeriesExecution = reportSeriesExecution;
  }

  public void addStatistic(UUID statisticId) {
    try {
      while (statisticService
          .getAggregationResultState(statisticId)
          .equals(AggregationResultState.CREATING)) {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> workOnStatistic(statisticId));
      }
    } catch (Exception e) {
      log.error("Could not complete statistic", e);
      setState(statisticId, AggregationResultState.FAILED);
    }
  }

  private void workOnStatistic(UUID statisticId) {
    AggregationResultStateInformation stateInformation =
        statisticService.getStateInformation(statisticId);

    switch (stateInformation.pendingState()) {
      case DATA_AGGREGATION -> statisticService.aggregateData(statisticId);
      case MIN_MAX_DETERMINATION -> statisticService.minMaxDetermination(statisticId);
      case EVALUATION_CONDUCTION -> evaluationService.evaluationConduction(statisticId);
      case DIAGRAM_CREATION -> diagramCreationService.diagramRecreation(statisticId);
      default -> {
        // ignore
      }
    }
  }

  private void setState(UUID statisticId, AggregationResultState state) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> statisticService.setState(statisticId, state));
  }

  public void updateStatistic(UUID statisticId) {
    try {
      removeStatisticData(statisticId, AggregationResultPendingState.DATA_AGGREGATION);
      updateStatisticData(statisticId);
    } catch (Exception e) {
      log.error("Could not update statistic", e);
      setState(statisticId, AggregationResultState.FAILED);
    }
  }

  private void removeStatisticData(
      UUID statisticId, AggregationResultPendingState pendingStateAfterRemoval) {
    while (TABLE_ROWS_REMOVAL.equals(
        statisticService.getAggregationResultPendingState(statisticId))) {
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> statisticService.removeTableRows(statisticId, pendingStateAfterRemoval));
    }
  }

  private void updateStatisticData(UUID statisticId) {
    while (statisticService
        .getAggregationResultState(statisticId)
        .equals(AggregationResultState.UPDATING)) {
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> workOnStatistic(statisticId));
    }
  }

  public void cloneStatistic(UUID originalId, UUID copyId) {
    try {
      while (statisticService
          .getAggregationResultState(originalId)
          .equals(AggregationResultState.COPY_ONGOING)) {
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> statisticCopyService.workOnCopy(originalId, copyId));
      }
    } catch (Exception e) {
      log.error("Could not complete cloning statistic", e);
      setState(originalId, AggregationResultState.COMPLETED);
      setState(copyId, AggregationResultState.FAILED);
    }
  }

  public void deleteStatistic(UUID statisticId) {
    try {
      deleteAllReportSeries(statisticId);
      removeStatisticData(statisticId, null);
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> statisticService.deleteStatistic(statisticId));
    } catch (Exception e) {
      log.error("Could not delete statistic {}", statisticId, e);
      setFailed(statisticId);
    }
  }

  private void deleteAllReportSeries(UUID statisticId) {
    Set<UUID> ids = statisticService.getReportSeriesIdsOfStatistic(statisticId);
    ids.forEach(
        id -> {
          if (!reportSeriesExecution.deleteReportSeries(id)) {
            throw new IncompleteDeletionException();
          }
        });
  }

  private void setFailed(UUID statisticId) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> statisticService.setStateToFailed(statisticId));
  }
}
