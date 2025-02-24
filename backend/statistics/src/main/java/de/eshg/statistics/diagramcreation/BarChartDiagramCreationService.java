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
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BarChartDiagramCreationService
    extends AbstractChartDiagramCreationService<
        Map<Object, Map<Object, Integer>>, BarChartConfigurationDto> {
  public BarChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    super(analysisService, analysisRepository, tableRowRepository, statisticsConfig);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<Object, Map<Object, Integer>> initializeChartDataHolder(
      UUID analysisId,
      BarChartConfigurationDto barChartConfigurationDto,
      List<TableColumnFilterParameter> filters) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    AggregationResultUtil.validateColumnFilters(filters, aggregationResult);

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);

    Map<Object, Map<Object, Integer>> chartDataHolder =
        createChartDataHolderMap(primaryTableColumn.getValueType());
    initiallyFillBarChartMap(
        chartDataHolder,
        getKeysForIntegerBooleanOrValueOptions(primaryTableColumn),
        secondaryTableColumn);

    return chartDataHolder;
  }

  private static Map<Object, Map<Object, Integer>> createChartDataHolderMap(
      TableColumnValueType valueType) {
    return switch (valueType) {
      case BOOLEAN, INTEGER, VALUE_WITH_OPTIONS -> new LinkedHashMap<>();
      default -> new TreeMap<>();
    };
  }

  private static List<?> getKeysForIntegerBooleanOrValueOptions(TableColumn primaryTableColumn) {
    return switch (primaryTableColumn.getValueType()) {
      case INTEGER -> getIntegerKeys(primaryTableColumn.getMinMaxNullUnknownValues());
      case BOOLEAN, VALUE_WITH_OPTIONS -> getKeysForBooleanOrValueOptionsList(primaryTableColumn);
      default -> List.of();
    };
  }

  private static List<Integer> getIntegerKeys(MinMaxNullUnknownValues minMaxNullUnknownValues) {
    List<Integer> integerKeys = new ArrayList<>();
    if (minMaxNullUnknownValues.getMinInteger() != null
        && minMaxNullUnknownValues.getMaxInteger() != null) {
      IntStream.rangeClosed(
              minMaxNullUnknownValues.getMinInteger(), minMaxNullUnknownValues.getMaxInteger())
          .forEach(integerKeys::add);
    }
    if (minMaxNullUnknownValues.getUnknownValue() != null) {
      integerKeys.add(Integer.parseInt(minMaxNullUnknownValues.getUnknownValue()));
    }
    return integerKeys;
  }

  private static void initiallyFillBarChartMap(
      Map<Object, Map<Object, Integer>> chartDataHolder,
      List<?> keys,
      TableColumn secondaryTableColumn) {
    keys.forEach(key -> chartDataHolder.put(key, createCountingMap(secondaryTableColumn)));
  }

  @Override
  @Transactional(readOnly = true)
  public int collectChartData(
      UUID analysisId,
      BarChartConfigurationDto barChartConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      Map<Object, Map<Object, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    AbstractAggregationResult aggregationResult = analysis.getAggregationResult();

    TableColumn primaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.primaryAttribute(), aggregationResult);
    TableColumn secondaryTableColumn =
        AggregationResultUtil.getTableColumn(
            barChartConfigurationDto.secondaryAttribute(), aggregationResult);

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
      Map<Object, Map<Object, Integer>> chartDataHolder,
      TableColumn primaryTableColumn,
      TableColumn secondaryTableColumn) {
    Object primaryKey =
        getKeyForCellEntryBooleanIntegerTextOrValueOption(
            getCellEntry(tableRow, primaryTableColumn));

    Object secondaryKey;
    if (secondaryTableColumn == null) {
      secondaryKey = primaryKey;
    } else {
      secondaryKey =
          getKeyForCellEntryBooleanIntegerTextOrValueOption(
              getCellEntry(tableRow, secondaryTableColumn));
    }

    addTableRowToChartDataHolder(chartDataHolder, primaryKey, secondaryKey, secondaryTableColumn);
  }

  @Override
  @Transactional
  public UUID addDiagram(
      UUID analysisId,
      BarChartConfigurationDto barChartConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      Map<Object, Map<Object, Integer>> chartDataHolder) {
    Analysis analysis = analysisService.getAnalysisInternal(analysisId);
    fillChartDataHolderWithMissingValues(
        chartDataHolder, barChartConfigurationDto.secondaryAttribute() == null);

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

  private static List<BarGroupData> getBarGroupDataList(
      Map<Object, Map<Object, Integer>> chartDataHolder) {
    return chartDataHolder.entrySet().stream()
        .map(entry -> mapToBarGroupData(entry.getKey(), entry.getValue()))
        .toList();
  }

  private static BarGroupData mapToBarGroupData(
      Object primaryKey, Map<Object, Integer> keyToCountStringIntegerMap) {
    List<KeyToCount> keyToCounts = mapToKeyToCounts(keyToCountStringIntegerMap);

    BarGroupData barGroupData = new BarGroupData();
    barGroupData.setKey(String.valueOf(primaryKey));
    barGroupData.addKeyToCounts(keyToCounts);
    return barGroupData;
  }
}
