/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.base.SortDirection;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.statistics.api.GetStatisticResponse;
import de.eshg.statistics.api.GetStatisticsResponse;
import de.eshg.statistics.api.StatisticInfo;
import de.eshg.statistics.api.StatisticSortKey;
import de.eshg.statistics.api.StatisticStateDto;
import de.eshg.statistics.api.TableColumnHeader;
import de.eshg.statistics.api.attributes.AbstractTableColumnHeaderAttribute;
import de.eshg.statistics.api.attributes.BooleanAttribute;
import de.eshg.statistics.api.attributes.CentralFileIdAttribute;
import de.eshg.statistics.api.attributes.DateAttribute;
import de.eshg.statistics.api.attributes.DecimalAttribute;
import de.eshg.statistics.api.attributes.IntegerAttribute;
import de.eshg.statistics.api.attributes.ProcedureIdAttribute;
import de.eshg.statistics.api.attributes.TextAttribute;
import de.eshg.statistics.api.attributes.ValueOption;
import de.eshg.statistics.api.attributes.ValueWithOptionsAttribute;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.evaluationtemplate.BaseDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.BusinessDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.DataSourceWithAttributeNames;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult_;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public class StatisticMapper {
  private StatisticMapper() {}

  public static GetStatisticResponse mapToApi(
      Statistic statistic, List<TableRow> tableRows, long totalNumberOfElements) {
    Set<Integer> indexesOfCentralFileIds = getIndexesOfCentralFileIds(statistic.getTableColumns());
    return new GetStatisticResponse(
        mapToStatisticInfo(statistic),
        mapColumnsToApi(statistic.getTableColumns(), indexesOfCentralFileIds),
        mapRowsToApi(tableRows, indexesOfCentralFileIds),
        totalNumberOfElements);
  }

  private static Set<Integer> getIndexesOfCentralFileIds(List<TableColumn> tableColumns) {
    return IntStream.range(0, tableColumns.size())
        .filter(index -> tableColumns.get(index).getValueType().equals(ValueType.CENTRAL_FILE_ID))
        .boxed()
        .collect(Collectors.toSet());
  }

  public static List<TableColumnHeader> mapToApi(List<TableColumn> tableColumns) {
    Set<Integer> indexesOfCentralFileIds = getIndexesOfCentralFileIds(tableColumns);
    return mapColumnsToApi(tableColumns, indexesOfCentralFileIds);
  }

  private static List<TableColumnHeader> mapColumnsToApi(
      List<TableColumn> tableColumns, Set<Integer> indexesOfCentralFileIds) {
    return IntStream.range(0, tableColumns.size())
        .filter(index -> !indexesOfCentralFileIds.contains(index))
        .boxed()
        .map(index -> mapToApi(tableColumns.get(index)))
        .toList();
  }

  private static TableColumnHeader mapToApi(TableColumn tableColumn) {
    if (tableColumn.getBaseModuleAttributeCode() == null) {
      return new TableColumnHeader(
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getDataSourceName(),
          mapNonCentralFileIdAttribute(
              tableColumn.getValueType(),
              tableColumn.getBusinessModuleAttributeName(),
              tableColumn.getBusinessModuleAttributeCode(),
              tableColumn.getUnit(),
              tableColumn.getValueToMeanings(),
              tableColumn.getMinMaxNullUnknownValues()));
    } else {
      return new TableColumnHeader(
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getDataSourceName(),
          new CentralFileIdAttribute(
              tableColumn.getBusinessModuleAttributeName(),
              tableColumn.getBusinessModuleAttributeCode(),
              mapNonCentralFileIdAttribute(
                  tableColumn.getValueType(),
                  tableColumn.getBaseModuleAttributeName(),
                  tableColumn.getBaseModuleAttributeCode(),
                  tableColumn.getUnit(),
                  tableColumn.getValueToMeanings(),
                  tableColumn.getMinMaxNullUnknownValues())));
    }
  }

  private static AbstractTableColumnHeaderAttribute mapNonCentralFileIdAttribute(
      ValueType valueType,
      String attributeName,
      String attributeCode,
      String unit,
      List<ValueToMeaning> valueToMeanings,
      MinMaxNullUnknownValues minMaxNullUnknownValues) {
    return switch (valueType) {
      case BOOLEAN -> new BooleanAttribute(attributeName, attributeCode);
      case DATE ->
          new DateAttribute(attributeName, attributeCode, mapMeaningsToApi(valueToMeanings));
      case DECIMAL ->
          new DecimalAttribute(
              attributeName,
              attributeCode,
              unit,
              mapMeaningsToApi(valueToMeanings),
              getNumberValue(minMaxNullUnknownValues, MinMaxNullUnknownValues::getMinDecimal),
              getNumberValue(minMaxNullUnknownValues, MinMaxNullUnknownValues::getMaxDecimal));
      case INTEGER ->
          new IntegerAttribute(
              attributeName,
              attributeCode,
              unit,
              mapMeaningsToApi(valueToMeanings),
              getNumberValue(minMaxNullUnknownValues, MinMaxNullUnknownValues::getMinInteger),
              getNumberValue(minMaxNullUnknownValues, MinMaxNullUnknownValues::getMaxInteger));
      case TEXT ->
          new TextAttribute(attributeName, attributeCode, mapMeaningsToApi(valueToMeanings));
      case VALUE_WITH_OPTIONS ->
          new ValueWithOptionsAttribute(
              attributeName, attributeCode, mapMeaningsToApi(valueToMeanings));
      case PROCEDURE_ID -> new ProcedureIdAttribute(attributeName, attributeCode);
      case CENTRAL_FILE_ID ->
          throw new IllegalArgumentException(
              "Value type %s not allowed for mapping".formatted(ValueType.CENTRAL_FILE_ID.name()));
    };
  }

  private static <T> T getNumberValue(
      MinMaxNullUnknownValues minMaxNullUnknownValues,
      Function<MinMaxNullUnknownValues, T> getter) {
    if (minMaxNullUnknownValues == null) {
      return null;
    } else {
      return getter.apply(minMaxNullUnknownValues);
    }
  }

  private static List<ValueOption> mapMeaningsToApi(List<ValueToMeaning> valueToMeanings) {
    return valueToMeanings.stream().map(StatisticMapper::mapToApi).toList();
  }

  private static ValueOption mapToApi(ValueToMeaning valueToMeaning) {
    return new ValueOption(valueToMeaning.getValue(), valueToMeaning.getMeaning());
  }

  private static List<DataRow> mapRowsToApi(
      List<TableRow> tableRows, Set<Integer> indexesOfCentralFileIds) {
    return tableRows.stream().map(tableRow -> mapToApi(tableRow, indexesOfCentralFileIds)).toList();
  }

  private static DataRow mapToApi(TableRow tableRow, Set<Integer> indexesOfCentralFileIds) {
    return new DataRow(
        IntStream.range(0, tableRow.getCellEntries().size())
            .filter(index -> !indexesOfCentralFileIds.contains(index))
            .boxed()
            .map(index -> tableRow.getCellEntries().get(index).getValue())
            .toList());
  }

  public static List<ValueToMeaning> mapToPersistence(List<ValueOptionInternal> valueOptions) {
    if (valueOptions == null) {
      return Collections.emptyList();
    } else {
      return valueOptions.stream().map(StatisticMapper::mapToPersistence).toList();
    }
  }

  private static ValueToMeaning mapToPersistence(ValueOptionInternal valueOption) {
    ValueToMeaning valueToMeaning = new ValueToMeaning();
    valueToMeaning.setValue(valueOption.value());
    valueToMeaning.setMeaning(valueOption.meaning());
    valueToMeaning.setUnknownValue(valueOption.isUnknownValue());
    return valueToMeaning;
  }

  public static String mapSortKey(StatisticSortKey sortKey) {
    return switch (sortKey) {
      case NAME -> AbstractAggregationResult_.NAME;
      case CREATED_AT -> AbstractAggregationResult_.CREATED_AT;
      case TIME_RANGE_START -> AbstractAggregationResult_.TIME_RANGE_START;
      case TIME_RANGE_END -> AbstractAggregationResult_.TIME_RANGE_END;
    };
  }

  public static Sort.Direction mapSortDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }

  public static GetStatisticsResponse mapStatisticPageToResponse(
      Page<Statistic> statisticPage, Map<UUID, UserDto> resolvedUsers) {
    return new GetStatisticsResponse(
        statisticPage.stream().map(StatisticMapper::mapToStatisticInfo).toList(),
        resolvedUsers,
        statisticPage.getTotalElements());
  }

  public static StatisticInfo mapToStatisticInfo(Statistic statistic) {
    return new StatisticInfo(
        statistic.getExternalId(),
        statistic.getCreatedByUserId(),
        statistic.getName(),
        statistic.getTableColumns().stream()
            .map(TableColumn::getDataSourceName)
            .distinct()
            .sorted()
            .toList(),
        mapStatisticState(statistic.getState()),
        statistic.getTimeRangeStart(),
        statistic.getTimeRangeEnd(),
        statistic.getCreatedAt(),
        statistic.isAnonymized());
  }

  public static StatisticStateDto mapStatisticState(AggregationResultState aggregationResultState) {
    return StatisticStateDto.valueOf(aggregationResultState.name());
  }

  public static DataSourceDto mapToDataSourceCode(
      DataSourceWithAttributeNames dataSourceWithAttributeNames) {
    return new DataSourceDto(
        dataSourceWithAttributeNames.businessModuleName(),
        dataSourceWithAttributeNames.id(),
        dataSourceWithAttributeNames.dataAttributes().stream()
            .map(StatisticMapper::mapToBusinessDataAttributeCode)
            .toList());
  }

  private static BusinessDataAttribute mapToBusinessDataAttributeCode(
      BusinessDataAttributeWithName businessDataAttributeWithName) {
    return new BusinessDataAttribute(
        businessDataAttributeWithName.code(),
        businessDataAttributeWithName.baseDataAttributes().stream()
            .map(BaseDataAttributeWithName::code)
            .toList());
  }
}
