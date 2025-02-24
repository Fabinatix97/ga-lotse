/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.domain.model.BaseEntity;
import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.hibernate.Hibernate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistogramChartDiagramCreationService
    extends AbstractChartDiagramCreationService<
        Map<Long, Map<String, Integer>>, HistogramChartConfigurationDto> {
  public HistogramChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  Map<Long, Map<String, Integer>> initializeChartDataHolder() {
    return new HashMap<>();
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      HistogramChartConfigurationDto histogramChartConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<Long, Map<String, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();
    HistogramChartConfiguration chartConfiguration =
        (HistogramChartConfiguration)
            Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);

    if (chartConfiguration.getBins().isEmpty()) {
      return 0;
    }

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfigurationDto.secondaryAttribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
    }

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
      Map<Long, Map<String, Integer>> chartDataHolder,
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

    String secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = String.valueOf(primaryKey);
    } else {
      secondaryKey =
          getKeyForCellEntryBooleanTextOrValueOption(getCellEntry(tableRow, secondaryTableColumn));
    }

    addTableRowToCollectedChartData(primaryKey, secondaryKey, chartDataHolder);
  }

  @Override
  @Transactional
  public UUID addDiagram(
      UUID analysisId,
      HistogramChartConfigurationDto histogramChartConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      Map<Long, Map<String, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    HistogramChartConfiguration chartConfiguration =
        (HistogramChartConfiguration)
            Hibernate.unproxy(analysis.getChartConfiguration(), ChartConfiguration.class);
    fillHistogramChartDataWithMissingValues(
        chartDataHolder,
        chartConfiguration.getBins(),
        analysis.getAggregationResult(),
        histogramChartConfigurationDto);

    List<HistogramGroupData> histogramGroupDatas =
        chartConfiguration.getBins().stream()
            .map(
                bin ->
                    mapToHistogramGroupData(
                        bin,
                        chartDataHolder,
                        histogramChartConfigurationDto.secondaryAttribute() != null))
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

    HistogramChartData histogramChartData = new HistogramChartData();
    histogramChartData.setEvaluatedDataAmount(evaluatedEntries);
    histogramChartData.addHistogramGroupDatas(histogramGroupDatas);

    Diagram diagram =
        AnalysisMapper.mapToPersistence(addDiagramRequest, histogramChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  private static void fillHistogramChartDataWithMissingValues(
      Map<Long, Map<String, Integer>> chartDataHolder,
      List<HistogramBin> bins,
      AbstractAggregationResult aggregationResult,
      HistogramChartConfigurationDto histogramChartConfigurationDto) {
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            histogramChartConfigurationDto.secondaryAttribute(), aggregationResult);
    bins.forEach(bin -> chartDataHolder.computeIfAbsent(bin.getId(), k -> new HashMap<>()));
    if (secondaryTableColumn == null) {
      chartDataHolder.forEach(
          (key, secondaryMap) -> {
            String stringKey = String.valueOf(key);
            secondaryMap.computeIfAbsent(stringKey, k -> 0);
          });
    } else {
      Set<String> secondaryKeys;
      if (secondaryTableColumn.getValueType().equals(TableColumnValueType.TEXT)) {
        secondaryKeys = getKeysForTextValues(chartDataHolder);
      } else {
        secondaryKeys = getKeysForBooleanOrValueOption(secondaryTableColumn);
      }
      chartDataHolder
          .values()
          .forEach(
              secondaryMap ->
                  secondaryKeys.forEach(key -> secondaryMap.computeIfAbsent(key, k -> 0)));
    }
  }

  private static HistogramGroupData mapToHistogramGroupData(
      HistogramBin bin,
      Map<Long, Map<String, Integer>> chartDataHolder,
      boolean withSecondaryAttribute) {
    HistogramGroupData histogramGroupData = new HistogramGroupData();
    bin.addHistogramGroupData(histogramGroupData);

    Map<String, Integer> dataForBin = chartDataHolder.get(bin.getId());
    if (withSecondaryAttribute) {
      histogramGroupData.addKeyToCounts(mapToSortedKeyToCountList(dataForBin));
    } else {
      histogramGroupData.setCount(dataForBin.values().stream().mapToInt(count -> count).sum());
    }
    return histogramGroupData;
  }
}
