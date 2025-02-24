/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AggregationResultUtil;
import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BarChartDiagramCreationService
    extends AbstractChartDiagramCreationService<
        Map<String, Map<String, Integer>>, BarChartConfigurationDto> {
  public BarChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  Map<String, Map<String, Integer>> initializeChartDataHolder() {
    return new HashMap<>();
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      BarChartConfigurationDto barChartConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<String, Map<String, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);
    if (page == 0) {
      AggregationResultUtil.validateColumnFilters(filters, aggregationResult);
    }

    Stream<Specification<TableRow>> notNullSpecifications;
    if (secondaryTableColumn == null) {
      notNullSpecifications =
          Stream.of(TableRowSpecifications.getNotNullSpecification(primaryTableColumn));
    } else {
      notNullSpecifications =
          Stream.of(
              TableRowSpecifications.getNotNullSpecification(primaryTableColumn),
              TableRowSpecifications.getNotNullSpecification(secondaryTableColumn));
    }

    return collectDataForTablePageAndReturnMaxPage(
        page,
        notNullSpecifications,
        filters,
        aggregationResult,
        tableRow ->
            addTableRowToCollectedBarChartData(
                tableRow, chartDataHolder, primaryTableColumn, secondaryTableColumn));
  }

  private static void addTableRowToCollectedBarChartData(
      TableRow tableRow,
      Map<String, Map<String, Integer>> chartDataHolder,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    String primaryKey =
        getKeyForCellEntryBooleanTextOrValueOption(getCellEntry(tableRow, primaryTableColumn));

    String secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = primaryKey;
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
      BarChartConfigurationDto barChartConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      Map<String, Map<String, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    fillBarChartDataWithMissingValues(
        chartDataHolder, analysis.getAggregationResult(), barChartConfigurationDto);

    List<BarGroupData> groupDataList = getBarGroupDataList(chartDataHolder);

    int evaluatedEntries =
        groupDataList.stream()
            .map(BarGroupData::getKeyToCounts)
            .flatMap(Collection::stream)
            .mapToInt(KeyToCount::getCount)
            .sum();

    BarChartData barChartData = new BarChartData();
    barChartData.setEvaluatedDataAmount(evaluatedEntries);
    barChartData.addBarGroupDatas(groupDataList);

    Diagram diagram = AnalysisMapper.mapToPersistence(addDiagramRequest, barChartData, analysis);

    analysisRepository.flush();
    return diagram.getExternalId();
  }

  private static void fillBarChartDataWithMissingValues(
      Map<String, Map<String, Integer>> chartDataHolder,
      AbstractAggregationResult aggregationResult,
      BarChartConfigurationDto barChartConfigurationDto) {
    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);

    Set<String> primaryKeysBooleanValueOption = getKeysForBooleanOrValueOption(primaryTableColumn);
    if (secondaryTableColumn == null) {
      primaryKeysBooleanValueOption.forEach(
          key ->
              chartDataHolder.computeIfAbsent(
                  key,
                  secondaryKey -> {
                    Map<String, Integer> secondaryMap = new HashMap<>();
                    secondaryMap.put(secondaryKey, 0);
                    return secondaryMap;
                  }));
    } else {
      Set<String> secondaryKeys;
      if (secondaryTableColumn.getValueType().equals(TableColumnValueType.TEXT)) {
        secondaryKeys = getKeysForTextValues(chartDataHolder);
      } else {
        secondaryKeys = getKeysForBooleanOrValueOption(secondaryTableColumn);
      }
      primaryKeysBooleanValueOption.forEach(
          key -> chartDataHolder.computeIfAbsent(key, k -> new HashMap<>()));

      chartDataHolder
          .keySet()
          .forEach(
              primaryKey -> {
                Map<String, Integer> secondaryToIntegerMap = chartDataHolder.get(primaryKey);
                secondaryKeys.forEach(
                    key -> secondaryToIntegerMap.computeIfAbsent(key, secondaryKey -> 0));
              });
    }
  }

  private static List<BarGroupData> getBarGroupDataList(
      Map<String, Map<String, Integer>> chartDataHolder) {
    Map<String, BarGroupData> groupDataMap =
        chartDataHolder.entrySet().stream()
            .map(entry -> mapToBarGroupData(entry.getKey(), entry.getValue()))
            .collect(Collectors.toMap(BarGroupData::getKey, Function.identity()));

    return groupDataMap.keySet().stream().sorted().map(groupDataMap::get).toList();
  }

  private static BarGroupData mapToBarGroupData(
      String key, Map<String, Integer> keyToCountStringIntegerMap) {
    List<KeyToCount> keyToCounts = mapToSortedKeyToCountList(keyToCountStringIntegerMap);

    BarGroupData barGroupData = new BarGroupData();
    barGroupData.setKey(key);
    barGroupData.addKeyToCounts(keyToCounts);
    return barGroupData;
  }
}
