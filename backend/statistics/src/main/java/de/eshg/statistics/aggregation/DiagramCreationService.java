/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.PointBasedChartConfiguration;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
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

@Service
public class DiagramCreationService {
  private final EvaluationService evaluationService;

  public DiagramCreationService(EvaluationService evaluationService) {
    this.evaluationService = evaluationService;
  }

  public UUID createDiagram(EvaluationDto evaluationDto, AddDiagramRequest addDiagramRequest) {
    UUID evaluationId = evaluationDto.id();

    return switch (evaluationDto.chartConfiguration()) {
      case BarChartConfigurationDto barChartConfigurationDto ->
          addBarChartDiagramWithData(evaluationId, addDiagramRequest, barChartConfigurationDto);
      case ChoroplethMapConfigurationDto choroplethMapConfigurationDto ->
          addChoroplethMapWithData(evaluationId, addDiagramRequest, choroplethMapConfigurationDto);
      case HistogramChartConfigurationDto histogramChartConfigurationDto ->
          addHistogramChartDiagramWithData(
              evaluationId, addDiagramRequest, histogramChartConfigurationDto);
      case LineChartConfigurationDto lineChartConfigurationDto ->
          addPointBasedChartDiagramWithData(
              evaluationId, addDiagramRequest, lineChartConfigurationDto);
      case PieChartConfigurationDto pieChartConfigurationDto ->
          addPieChartDiagramWithData(evaluationId, addDiagramRequest, pieChartConfigurationDto);
      case ScatterChartConfigurationDto scatterChartConfigurationDto ->
          addPointBasedChartDiagramWithData(
              evaluationId, addDiagramRequest, scatterChartConfigurationDto);
    };
  }

  private UUID addBarChartDiagramWithData(
      UUID evaluationId,
      AddDiagramRequest addDiagramRequest,
      BarChartConfigurationDto barChartConfigurationDto) {
    Map<String, Map<String, Integer>> chartDataHolder = new HashMap<>();

    BiFunction<Map<String, Map<String, Integer>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            evaluationService.collectBarChartData(
                data, page, evaluationId, addDiagramRequest.filters(), barChartConfigurationDto);

    Function<Map<String, Map<String, Integer>>, UUID> addDiagramFunction =
        data ->
            evaluationService.addBarChartDiagram(
                evaluationId, addDiagramRequest, data, barChartConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addChoroplethMapWithData(
      UUID evaluationId,
      AddDiagramRequest addDiagramRequest,
      ChoroplethMapConfigurationDto choroplethMapConfigurationDto) {
    Map<String, List<BigDecimal>> chartDataHolder = new TreeMap<>();

    BiFunction<Map<String, List<BigDecimal>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            evaluationService.collectChoroplethMapData(
                data,
                page,
                evaluationId,
                addDiagramRequest.filters(),
                choroplethMapConfigurationDto);

    Function<Map<String, List<BigDecimal>>, UUID> addDiagramFunction =
        data ->
            evaluationService.addChoroplethMapDiagram(
                evaluationId, addDiagramRequest, data, choroplethMapConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addHistogramChartDiagramWithData(
      UUID evaluationId,
      AddDiagramRequest addDiagramRequest,
      HistogramChartConfigurationDto histogramChartConfigurationDto) {
    Map<Long, Map<String, Integer>> chartDataHolder = new HashMap<>();

    BiFunction<Map<Long, Map<String, Integer>>, Integer, Integer> collectDataFunction =
        (data, page) ->
            evaluationService.collectHistogramChartData(
                data,
                page,
                evaluationId,
                addDiagramRequest.filters(),
                histogramChartConfigurationDto);

    Function<Map<Long, Map<String, Integer>>, UUID> addDiagramFunction =
        data ->
            evaluationService.addHistogramChartDiagram(
                evaluationId, addDiagramRequest, data, histogramChartConfigurationDto);
    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addPieChartDiagramWithData(
      UUID evaluationId,
      AddDiagramRequest addDiagramRequest,
      PieChartConfigurationDto pieChartConfigurationDto) {
    Map<String, Integer> chartDataHolder = new HashMap<>();

    BiFunction<Map<String, Integer>, Integer, Integer> collectDataFunction =
        (data, page) ->
            evaluationService.collectPieChartData(
                data, page, evaluationId, addDiagramRequest.filters(), pieChartConfigurationDto);

    Function<Map<String, Integer>, UUID> addDiagramFunction =
        data ->
            evaluationService.addPieChartDiagram(
                evaluationId, addDiagramRequest, data, pieChartConfigurationDto);

    return collectDiagramDataAndAddDiagram(
        chartDataHolder, collectDataFunction, addDiagramFunction);
  }

  private UUID addPointBasedChartDiagramWithData(
      UUID evaluationId,
      AddDiagramRequest addDiagramRequest,
      PointBasedChartConfiguration pointBasedChartConfiguration) {
    List<DataPointHolder> chartDataHolder = new ArrayList<>();

    BiFunction<List<DataPointHolder>, Integer, Integer> collectDataFunction =
        (data, page) ->
            evaluationService.collectPointBasedChartData(
                data,
                page,
                evaluationId,
                addDiagramRequest.filters(),
                pointBasedChartConfiguration);

    Function<List<DataPointHolder>, UUID> addDiagramFunction =
        data ->
            evaluationService.addPointBasedChartDiagram(
                evaluationId, addDiagramRequest, data, pointBasedChartConfiguration);

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
}
