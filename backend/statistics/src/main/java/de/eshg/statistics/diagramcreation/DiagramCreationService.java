/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Evaluation;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiagramCreationService {
  private final BarChartDiagramCreationService barChartDiagramCreationService;
  private final ChoroplethMapDiagramCreationService choroplethMapDiagramCreationService;
  private final HistogramChartDiagramCreationService histogramChartDiagramCreationService;
  private final PieChartDiagramCreationService pieChartDiagramCreationService;
  private final PointBasedChartDiagramCreationService pointBasedChartDiagramCreationService;
  private final EvaluationService evaluationService;

  public DiagramCreationService(
      BarChartDiagramCreationService barChartDiagramCreationService,
      ChoroplethMapDiagramCreationService choroplethMapDiagramCreationService,
      HistogramChartDiagramCreationService histogramChartDiagramCreationService,
      PieChartDiagramCreationService pieChartDiagramCreationService,
      PointBasedChartDiagramCreationService pointBasedChartDiagramCreationService,
      EvaluationService evaluationService) {
    this.barChartDiagramCreationService = barChartDiagramCreationService;
    this.choroplethMapDiagramCreationService = choroplethMapDiagramCreationService;
    this.histogramChartDiagramCreationService = histogramChartDiagramCreationService;
    this.pieChartDiagramCreationService = pieChartDiagramCreationService;
    this.pointBasedChartDiagramCreationService = pointBasedChartDiagramCreationService;
    this.evaluationService = evaluationService;
  }

  public UUID createDiagram(AnalysisDto analysisDto, AddDiagramRequest addDiagramRequest) {
    UUID analysisId = analysisDto.id();

    return switch (analysisDto.chartConfiguration()) {
      case BarChartConfigurationDto barChartConfigurationDto ->
          addDiagramWithData(
              barChartDiagramCreationService,
              analysisId,
              barChartConfigurationDto,
              addDiagramRequest);
      case ChoroplethMapConfigurationDto choroplethMapConfigurationDto ->
          addDiagramWithData(
              choroplethMapDiagramCreationService,
              analysisId,
              choroplethMapConfigurationDto,
              addDiagramRequest);
      case HistogramChartConfigurationDto histogramChartConfigurationDto ->
          addDiagramWithData(
              histogramChartDiagramCreationService,
              analysisId,
              histogramChartConfigurationDto,
              addDiagramRequest);
      case LineChartConfigurationDto lineChartConfigurationDto ->
          addDiagramWithData(
              pointBasedChartDiagramCreationService,
              analysisId,
              lineChartConfigurationDto,
              addDiagramRequest);
      case PieChartConfigurationDto pieChartConfigurationDto ->
          addDiagramWithData(
              pieChartDiagramCreationService,
              analysisId,
              pieChartConfigurationDto,
              addDiagramRequest);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          addDiagramWithData(
              pointBasedChartDiagramCreationService,
              analysisId,
              scatterChartConfigurationDto,
              addDiagramRequest);
    };
  }

  private static <D, C> UUID addDiagramWithData(
      AbstractChartDiagramCreationService<D, C> service,
      UUID analysisId,
      C chartConfigurationDto,
      AddDiagramRequest addDiagramRequest) {
    D chartDataHolder =
        service.initializeChartDataHolder(
            analysisId, chartConfigurationDto, addDiagramRequest.filters());
    collectData(service, analysisId, chartConfigurationDto, addDiagramRequest, chartDataHolder);
    return service.addDiagram(
        analysisId, chartConfigurationDto, addDiagramRequest, chartDataHolder);
  }

  private static <D, C> void collectData(
      AbstractChartDiagramCreationService<D, C> service,
      UUID analysisId,
      C chartConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      D chartDataHolder) {
    int page = 0;
    int maxPage;
    while (true) {
      maxPage =
          service.collectChartData(
              analysisId,
              chartConfigurationDto,
              addDiagramRequest.filters(),
              page,
              chartDataHolder);
      if (page >= maxPage) {
        break;
      }
      page++;
    }
  }

  @Transactional
  public void diagramRecreation(UUID evaluationId) {
    Evaluation evaluation = evaluationService.getEvaluationInternal(evaluationId);
    recreateDiagrams(evaluation);
    evaluation.setPendingState(null);
    evaluation.setState(AggregationResultState.COMPLETED);
  }

  private void recreateDiagrams(Evaluation evaluation) {
    evaluation
        .getAnalyses()
        .forEach(
            analysis -> {
              AnalysisDto analysisDto = AnalysisMapper.mapToApi(analysis, true);
              List<AddDiagramRequest> addDiagramRequests =
                  analysis.getDiagrams().stream()
                      .map(
                          diagram ->
                              new AddDiagramRequest(
                                  diagram.getTitle(),
                                  diagram.getDescription(),
                                  FilterParameterMapper.mapToApi(diagram.getFilters())))
                      .toList();
              analysis.removeDiagrams();
              addDiagramRequests.forEach(
                  addDiagramRequest -> createDiagram(analysisDto, addDiagramRequest));
            });
  }
}
