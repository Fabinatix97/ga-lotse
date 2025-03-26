/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.domain.model.BaseEntity;
import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.hibernate.Hibernate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistogramChartDiagramCreationService
    extends AbstractChartDiagramCreationService<Map<Long, Map<Object, Integer>>> {
  public HistogramChartDiagramCreationService(
      AnalysisService analysisService,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, tableRowRepository, statisticsConfig);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Long, Map<Object, Integer>> initializeChartDataHolder(UUID diagramId) {
    Analysis analysis = analysisService.getDiagramInternal(diagramId).getAnalysis();
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();
    HistogramChartConfiguration histogramChartConfiguration =
        getHistogramChartConfiguration(analysis);

    HistogramChartConfiguration chartConfiguration =
        (HistogramChartConfiguration)
            Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfiguration.getSecondaryAttributeSelection(), aggregationResult);

    Map<Long, Map<Object, Integer>> chartDataHolder = new HashMap<>();

    chartConfiguration
        .getBins()
        .forEach(bin -> chartDataHolder.put(bin.getId(), createCountingMap(secondaryTableColumn)));

    return chartDataHolder;
  }

  private static HistogramChartConfiguration getHistogramChartConfiguration(Analysis analysis) {
    return (HistogramChartConfiguration) AnalysisMapper.getChartConfiguration(analysis);
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID diagramId, int page, Map<Long, Map<Object, Integer>> chartDataHolder) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);
    AbstractAggregationResult aggregationResult = diagram.getAnalysis().getAggregationResult();
    HistogramChartConfiguration chartConfiguration =
        getHistogramChartConfiguration(diagram.getAnalysis());

    if (chartConfiguration.getBins().isEmpty()) {
      return 0;
    }

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            chartConfiguration.getPrimaryAttributeSelection(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            chartConfiguration.getSecondaryAttributeSelection(), aggregationResult);

    Specification<TableRow> notNullNotUnknownSpecification =
        TableRowSpecifications.getNotNullAndNotUnknownSpecificationDecimalAndInteger(
            primaryTableColumn);

    Stream<Specification<TableRow>> specificationStream;
    if (secondaryTableColumn == null) {
      specificationStream = Stream.of(notNullNotUnknownSpecification);
    } else {
      specificationStream =
          Stream.of(
              notNullNotUnknownSpecification,
              TableRowSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    List<TableColumnFilterParameter> filters = FilterParameterMapper.mapToApi(diagram.getFilters());
    return collectDataForTablePageAndReturnMaxPage(
        page,
        specificationStream,
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedHistogramChartData(
                tableRow,
                chartDataHolder,
                chartConfiguration.getBins(),
                primaryTableColumn,
                secondaryTableColumn));
  }

  private static void addTableRowToCollectedHistogramChartData(
      TableRow tableRow,
      Map<Long, Map<Object, Integer>> chartDataHolder,
      List<HistogramBin> bins,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    BigDecimal value =
        getValueAsBigDecimal(
            primaryTableColumn.getValueType(), getCellEntry(tableRow, primaryTableColumn));

    Long primaryKey =
        bins.stream()
            .filter(
                bin ->
                    (bin.getLowerBound().compareTo(value) <= 0)
                        && (bin.getUpperBound().compareTo(value) >= 0))
            .findFirst()
            .map(BaseEntity::getId)
            .orElse(null);

    Object secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = primaryKey;
    } else {
      secondaryKey =
          getKeyForCellEntryBooleanIntegerTextDateOrValueOption(
              getCellEntry(tableRow, secondaryTableColumn));
    }

    addTableRowToChartDataHolder(chartDataHolder, primaryKey, secondaryKey, secondaryTableColumn);
  }

  @Override
  @Transactional
  public void fillDiagramData(UUID diagramId, Map<Long, Map<Object, Integer>> chartDataHolder) {
    Diagram diagram = analysisService.getDiagramInternal(diagramId);
    HistogramChartConfiguration chartConfiguration =
        getHistogramChartConfiguration(diagram.getAnalysis());
    fillChartDataHolderWithMissingValues(
        chartDataHolder, chartConfiguration.getSecondaryAttributeSelection() == null);

    List<HistogramGroupData> histogramGroupDatas =
        chartConfiguration.getBins().stream()
            .map(
                bin ->
                    mapToHistogramGroupData(
                        bin,
                        chartDataHolder,
                        chartConfiguration.getSecondaryAttributeSelection() != null))
            .toList();

    int evaluatedEntries =
        histogramGroupDatas.stream()
            .map(
                groupData -> {
                  if (groupData.getCount() == null) {
                    return groupData.getKeyToCounts().stream().mapToInt(KeyToCount::getCount).sum();
                  } else {
                    return groupData.getCount();
                  }
                })
            .mapToInt(groupDataCount -> groupDataCount)
            .sum();

    HistogramChartData histogramChartData = (HistogramChartData) diagram.getDiagramData();
    histogramChartData.setEvaluatedDataAmount(evaluatedEntries);
    histogramChartData.addHistogramGroupDatas(histogramGroupDatas);
    diagram.setDiagramDataEmpty(false);
  }

  private static HistogramGroupData mapToHistogramGroupData(
      HistogramBin bin,
      Map<Long, Map<Object, Integer>> chartDataHolder,
      boolean withSecondaryAttribute) {
    HistogramGroupData histogramGroupData = new HistogramGroupData();
    bin.addHistogramGroupData(histogramGroupData);

    Map<Object, Integer> dataForBin = chartDataHolder.get(bin.getId());
    if (withSecondaryAttribute) {
      histogramGroupData.addKeyToCounts(mapToKeyToCounts(dataForBin));
    } else {
      histogramGroupData.setCount(dataForBin.get(bin.getId()));
    }
    return histogramGroupData;
  }
}
