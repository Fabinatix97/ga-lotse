/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.PointBasedChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Evaluation;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiagramCreationService {
  private final AnalysisService analysisService;
  private final EvaluationService evaluationService;

  public DiagramCreationService(
      AnalysisService analysisService, EvaluationService evaluationService) {
    this.analysisService = analysisService;
    this.evaluationService = evaluationService;
  }

  public UUID createDiagram(AnalysisDto analysisDto, AddDiagramRequest addDiagramRequest) {
    UUID analysisId = analysisDto.id();

    return switch (analysisDto.chartConfiguration()) {
      case BarChartConfigurationDto barChartConfigurationDto ->
          addBarChartDiagramWithData(analysisId, addDiagramRequest, barChartConfigurationDto);
      case ChoroplethMapConfigurationDto choroplethMapConfigurationDto ->
          addChoroplethMapWithData(analysisId, addDiagramRequest, choroplethMapConfigurationDto);
      case HistogramChartConfigurationDto histogramChartConfigurationDto ->
          addHistogramChartDiagramWithData(
              analysisId, addDiagramRequest, histogramChartConfigurationDto);
      case LineChartConfigurationDto lineChartConfigurationDto ->
          addPointBasedChartDiagramWithData(
              analysisId, addDiagramRequest, lineChartConfigurationDto);
      case PieChartConfigurationDto pieChartConfigurationDto ->
          addPieChartDiagramWithData(analysisId, addDiagramRequest, pieChartConfigurationDto);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          addPointBasedChartDiagramWithData(
              analysisId, addDiagramRequest, scatterChartConfigurationDto);
    };
  }

  private UUID addBarChartDiagramWithData(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      BarChartConfigurationDto barChartConfigurationDto) {
    Map<String, Map<String, Integer>> chartDataHolder = new HashMap<>();

    BiFunction<Map<String, Map<String, Integer>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            analysisService.collectBarChartData(
                data, page, analysisId, addDiagramRequest.filters(), barChartConfigurationDto);

    Function<Map<String, Map<String, Integer>>, UUID> addDiagramFunction =
        data ->
            analysisService.addBarChartDiagram(
                analysisId, addDiagramRequest, data, barChartConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addChoroplethMapWithData(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto) {
    Map<String, List<BigDecimal>> chartDataHolder = new TreeMap<>();

    BiFunction<Map<String, List<BigDecimal>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            analysisService.collectChoroplethMapData(
                data, page, analysisId, addDiagramRequest.filters(), choroplethMapConfigurationDto);

    Function<Map<String, List<BigDecimal>>, UUID> addDiagramFunction =
        data ->
            analysisService.addChoroplethMapDiagram(
                analysisId, addDiagramRequest, data, choroplethMapConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addHistogramChartDiagramWithData(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      HistogramChartConfigurationDto histogramChartConfigurationDto) {
    Map<Long, Map<String, Integer>> chartDataHolder = new HashMap<>();

    BiFunction<Map<Long, Map<String, Integer>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            analysisService.collectHistogramChartData(
                data,
                page,
                analysisId,
                addDiagramRequest.filters(),
                histogramChartConfigurationDto);

    Function<Map<Long, Map<String, Integer>>, UUID> addDiagramFunction =
        data ->
            analysisService.addHistogramChartDiagram(
                analysisId, addDiagramRequest, data, histogramChartConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addPieChartDiagramWithData(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      PieChartConfigurationDto pieChartConfigurationDto) {
    Map<String, Integer> chartDataHolder = new HashMap<>();

    BiFunction<Map<String, Integer>, Integer, Integer> collectDataFunction =
        (data, page) ->
            analysisService.collectPieChartData(
                data, page, analysisId, addDiagramRequest.filters(), pieChartConfigurationDto);

    Function<Map<String, Integer>, UUID> addDiagramFunction =
        data ->
            analysisService.addPieChartDiagram(
                analysisId, addDiagramRequest, data, pieChartConfigurationDto);

    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addPointBasedChartDiagramWithData(
      UUID analysisId,
      AddDiagramRequest addDiagramRequest,
      PointBasedChartConfigurationDto pointBasedChartConfiguration) {
    List<DataPointHolder> chartDataHolder = new ArrayList<>();

    BiFunction<List<DataPointHolder>, Integer, Integer> collectDataFunction =
        (data, page) ->
            analysisService.collectPointBasedChartData(
                data, page, analysisId, addDiagramRequest.filters(), pointBasedChartConfiguration);

    Function<List<DataPointHolder>, UUID> addDiagramFunction =
        data ->
            analysisService.addPointBasedChartDiagram(
                analysisId, addDiagramRequest, data, pointBasedChartConfiguration);

    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private <T> UUID collectDiagramDataAndAddDiagram(
      T chartDataHolder,
      BiFunction<T, Integer, Integer> collectDataFunction,
      Function<T, UUID> addDiagramFunction) {
    int page = 0;
    int maxPage;
    while (true) {
      maxPage = collectDataFunction.apply(chartDataHolder, page);
      if (page >= maxPage) {
        break;
      }
      page++;
    }

    return addDiagramFunction.apply(chartDataHolder);
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
