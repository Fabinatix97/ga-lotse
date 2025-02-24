/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import de.eshg.statistics.aggregation.AnalysisService;
import de.eshg.statistics.aggregation.TableRowSpecifications;
import de.eshg.statistics.api.AddDiagramRequest;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.repository.AnalysisRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;

public abstract class AbstractChartDiagramCreationService<D, C> {
  private static final List<String> BOOLEAN_KEYS = List.of("Ja", "Nein");

  protected final AnalysisService analysisService;
  protected final AnalysisRepository analysisRepository;

  private final TableRowRepository tableRowRepository;
  private final int pageSizeForCollectionDiagramData;

  protected AbstractChartDiagramCreationService(
      AnalysisService analysisService,
      AnalysisRepository analysisRepository,
      TableRowRepository tableRowRepository,
      StatisticsConfig statisticsConfig) {
    this.analysisService = analysisService;
    this.analysisRepository = analysisRepository;
    this.tableRowRepository = tableRowRepository;
    this.pageSizeForCollectionDiagramData = statisticsConfig.diagramData().pageSize();
  }

  abstract D initializeChartDataHolder(
      UUID analysisId, C chartConfigurationDto, List<TableColumnFilterParameter> filters);

  abstract int collectChartData(
      UUID analysisId,
      C chartConfigurationDto,
      List<TableColumnFilterParameter> filters,
      int page,
      D chartDataHolder);

  abstract UUID addDiagram(
      UUID analysisId,
      C chartConfigurationDto,
      AddDiagramRequest addDiagramRequest,
      D chartDataHolder);

  protected static Map<Object, Integer> createCountingMap(TableColumn tableColumn) {
    if (tableColumn == null) {
      return new HashMap<>();
    } else if (tableColumn.getValueType().equals(TableColumnValueType.BOOLEAN)
        || tableColumn.getValueType().equals(TableColumnValueType.VALUE_WITH_OPTIONS)) {
      LinkedHashMap<Object, Integer> countingMap = new LinkedHashMap<>();
      initiallyFillKeyToCountingMapForStringKeys(
          countingMap, getKeysForBooleanOrValueOptionsList(tableColumn));
      return countingMap;
    } else {
      return new TreeMap<>();
    }
  }

  protected static List<String> getKeysForBooleanOrValueOptionsList(TableColumn tableColumn) {
    if (tableColumn.getValueType().equals(TableColumnValueType.BOOLEAN)) {
      return BOOLEAN_KEYS;
    } else {
      return tableColumn.getValueToMeanings().stream().map(ValueToMeaning::getValue).toList();
    }
  }

  protected static void initiallyFillKeyToCountingMapForStringKeys(
      Map<Object, Integer> destination, List<String> keys) {
    keys.forEach(key -> destination.put(key, 0));
  }

  protected static CellEntry getCellEntry(TableRow tableRow, TableColumn tableColumn) {
    return tableRow.getCellEntries().stream()
        .filter(cellEntry -> cellEntry.getTableColumn().getId().equals(tableColumn.getId()))
        .findFirst()
        .orElseThrow();
  }

  protected int collectDataForTablePageAndReturnMaxPage(
      int page,
      Stream<Specification<TableRow>> attributeSpecificationStream,
      List<TableColumnFilterParameter> filters,
      AbstractAggregationResult aggregationResult,
      Consumer<TableRow> tableRowDataCollector) {

    Stream<Specification<TableRow>> attributePlusFilters =
        Stream.concat(
            attributeSpecificationStream, getFilterSpecificationStream(filters, aggregationResult));

    Specification<TableRow> specification =
        Specification.allOf(
            Stream.concat(
                    Stream.of(
                        TableRowSpecifications.tableRowOfAggregationOrderByTableRowId(
                            aggregationResult)),
                    attributePlusFilters)
                .toList());

    Page<TableRow> tableRowPage =
        tableRowRepository.findAll(
            specification, PageRequest.of(page, pageSizeForCollectionDiagramData));

    tableRowPage.get().forEach(tableRowDataCollector);

    long totalElements = tableRowPage.getTotalElements();
    if (totalElements % pageSizeForCollectionDiagramData == 0) {
      return ((int) totalElements / pageSizeForCollectionDiagramData) - 1;
    } else {
      return (int) totalElements / pageSizeForCollectionDiagramData;
    }
  }

  private static Stream<Specification<TableRow>> getFilterSpecificationStream(
      List<TableColumnFilterParameter> filters, AbstractAggregationResult aggregationResult) {
    if (CollectionUtils.isEmpty(filters)) {
      return Stream.empty();
    }
    return filters.stream()
        .map(filter -> TableRowSpecifications.createFilterSpecification(filter, aggregationResult));
  }

  protected static Object getKeyForCellEntryBooleanIntegerTextOrValueOption(CellEntry cellEntry) {
    if (cellEntry.getValue() == null) {
      return null;
    }
    if (cellEntry.getTableColumn().getValueType().equals(TableColumnValueType.BOOLEAN)) {
      return Boolean.TRUE.equals(cellEntry.getValue()) ? "Ja" : "Nein";
    }
    if (cellEntry.getTableColumn().getValueType().equals(TableColumnValueType.INTEGER)) {
      return cellEntry.getValue();
    }
    if (cellEntry.getTableColumn().getValueType().equals(TableColumnValueType.TEXT)) {
      return cellEntry.getValue().toString();
    }
    String stringValue = cellEntry.getValue().toString();
    if (cellEntry.getTableColumn().getValueType().equals(TableColumnValueType.VALUE_WITH_OPTIONS)
        && getValueToMeaningKeysSet(cellEntry.getTableColumn()).contains(stringValue)) {
      return stringValue;
    }
    return null;
  }

  protected static Set<String> getValueToMeaningKeysSet(TableColumn tableColumn) {
    return tableColumn.getValueToMeanings().stream()
        .map(ValueToMeaning::getValue)
        .collect(Collectors.toSet());
  }

  protected static <T> void addTableRowToChartDataHolder(
      Map<T, Map<Object, Integer>> chartDataHolder,
      T primaryKey,
      Object secondaryKey,
      TableColumn secondaryTableColumn) {
    if (primaryKey == null || secondaryKey == null) {
      return;
    }

    Map<Object, Integer> secondaryToIntegerMap =
        chartDataHolder.computeIfAbsent(primaryKey, key -> createCountingMap(secondaryTableColumn));
    secondaryToIntegerMap.compute(secondaryKey, (key, count) -> (count == null) ? 1 : count + 1);
  }

  protected static BigDecimal getValueAsBigDecimal(
      TableColumnValueType valueType, CellEntry cellEntry) {
    return switch (valueType) {
      case TableColumnValueType.BOOLEAN ->
          Boolean.TRUE.equals(((BooleanEntry) cellEntry).getBoolValue())
              ? BigDecimal.ONE
              : BigDecimal.ZERO;
      case TableColumnValueType.DECIMAL -> ((DecimalEntry) cellEntry).getBigDecimalValue();
      case TableColumnValueType.INTEGER ->
          new BigDecimal(((IntegerEntry) cellEntry).getIntegerValue());
      default -> throw new IllegalStateException("Unexpected value: " + valueType);
    };
  }

  protected static <T> void fillChartDataHolderWithMissingValues(
      Map<T, Map<Object, Integer>> chartDataHolder, boolean onlyPrimaryAttribute) {
    if (onlyPrimaryAttribute) {
      chartDataHolder
          .keySet()
          .forEach(key -> chartDataHolder.get(key).computeIfAbsent(key, k -> 0));
    } else {
      Set<Object> secondaryKeys =
          chartDataHolder.values().stream()
              .map(Map::keySet)
              .flatMap(Collection::stream)
              .collect(Collectors.toSet());
      chartDataHolder
          .values()
          .forEach(
              secondaryToIntegerMap ->
                  secondaryKeys.forEach(
                      key -> secondaryToIntegerMap.computeIfAbsent(key, secondaryKey -> 0)));
    }
  }

  protected static List<KeyToCount> mapToKeyToCounts(
      Map<Object, Integer> keyToCountStringIntegerMap) {
    return keyToCountStringIntegerMap.entrySet().stream()
        .map(entry -> getKeyToCount(String.valueOf(entry.getKey()), entry.getValue()))
        .toList();
  }

  private static KeyToCount getKeyToCount(String key, Integer count) {
    KeyToCount keyToCount = new KeyToCount();
    keyToCount.setKey(key);
    keyToCount.setCount(count);
    return keyToCount;
  }
}
