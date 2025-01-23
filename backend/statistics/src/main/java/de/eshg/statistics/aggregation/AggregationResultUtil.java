/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.mapper.AttributeSelectionMapper.SEARCH_KEY_DELIMITER;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.mapper.AttributeSelectionMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;

public class AggregationResultUtil {
  private AggregationResultUtil() {}

  public static void validateTimeRange(Instant timeRangeStart, Instant timeRangeEnd) {
    if (!timeRangeStart.isBefore(timeRangeEnd)) {
      throw new BadRequestException("Time range is invalid: start not before end");
    }
  }

  public static void validateSameSensitivityPossible(
      AbstractAggregationResult aggregationResult, List<AvailableDataSource> availableDataSources) {
    checkAllDataSourcesExist(aggregationResult, availableDataSources);
    List<AvailableDataSource> relevantAvailableDataSources =
        getRelevantAvailableDataSources(aggregationResult, availableDataSources);

    StatisticsDataSensitivity statisticsDataSensitivity = aggregationResult.getDataSensitivity();
    if (statisticsDataSensitivity.equals(StatisticsDataSensitivity.ANONYMOUS)
        && !DataSourceValidator.getCanBeAnonymized(relevantAvailableDataSources)
        && !DataSourceValidator.getMostRestrictiveSensitivity(relevantAvailableDataSources)
            .equals(DataSourceSensitivity.ANONYMOUS)) {
      throw new BadRequestException("Data source is not anonymous and cannot be anonymized");
    }
    if (statisticsDataSensitivity.equals(StatisticsDataSensitivity.INTERNAL_USAGE)
        && !DataSourceValidator.getMostRestrictiveSensitivity(relevantAvailableDataSources)
            .equals(DataSourceSensitivity.INTERNAL_USAGE)) {
      throw new BadRequestException("Data source changed the sensitivity");
    }
    if (statisticsDataSensitivity.equals(StatisticsDataSensitivity.SENSITIVE)
        && !DataSourceValidator.getMostRestrictiveSensitivity(relevantAvailableDataSources)
            .equals(DataSourceSensitivity.SENSITIVE)) {
      throw new BadRequestException("Data source changed the sensitivity");
    }
  }

  private static void checkAllDataSourcesExist(
      AbstractAggregationResult aggregationResult, List<AvailableDataSource> availableDataSources) {
    if (aggregationResult.getTableColumns().stream()
        .anyMatch(
            tableColumn ->
                availableDataSources.stream()
                    .noneMatch(
                        availableDataSource ->
                            isSameDataSource(tableColumn, availableDataSource)))) {
      throw new BadRequestException("At least one data source can not be found");
    }
  }

  private static List<AvailableDataSource> getRelevantAvailableDataSources(
      AbstractAggregationResult aggregationResult, List<AvailableDataSource> availableDataSources) {
    return availableDataSources.stream()
        .filter(
            availableDataSource ->
                aggregationResult.getTableColumns().stream()
                    .anyMatch(tableColumn -> isSameDataSource(tableColumn, availableDataSource)))
        .toList();
  }

  public static boolean isSameDataSource(
      TableColumn tableColumn, AvailableDataSource availableDataSource) {
    return tableColumn.getDataSourceId().equals(availableDataSource.id())
        && tableColumn.getBusinessModuleName().equals(availableDataSource.businessModuleName());
  }

  public static TableColumn getTableColumn(
      AttributeSelectionDto attributeSelection, AbstractAggregationResult aggregationResult) {
    if (attributeSelection == null) {
      return null;
    }
    return getTableColumn(
        AttributeSelectionMapper.buildSearchKey(
            attributeSelection.businessModuleAttributeCode(),
            attributeSelection.dataSourceId(),
            attributeSelection.businessModuleName(),
            attributeSelection.baseModuleAttributeCode()),
        aggregationResult);
  }

  public static TableColumn getTableColumn(
      String searchKey, AbstractAggregationResult aggregationResult) {
    if (searchKey == null) {
      return null;
    }
    return aggregationResult.getTableColumns().stream()
        .filter(tableColumn -> tableColumn.getSearchKey().equals(searchKey))
        .findFirst()
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Table column '%s' not found in aggregation result with id '%s'"
                        .formatted(
                            StringUtils.substringBefore(searchKey, SEARCH_KEY_DELIMITER),
                            aggregationResult.getExternalId())));
  }

  public static void validateColumnFilters(
      List<TableColumnFilterParameter> filters, AbstractAggregationResult aggregationResult) {
    if (filters == null) {
      return;
    }

    filters.forEach(filter -> validateColumnFilter(filter, aggregationResult));
  }

  private static void validateColumnFilter(
      TableColumnFilterParameter filter, AbstractAggregationResult aggregationResult) {
    validateBooleanFilter(filter);
    validateDecimalRangeFilter(filter);
    validateIntegerRangeFilter(filter);
    validateValueOptionFilter(filter);

    TableColumn filterTableColumn =
        Objects.requireNonNull(getTableColumn(filter.attribute(), aggregationResult));

    boolean invalidFilter = filterDoesNotMatchColumn(filter, filterTableColumn);

    if (invalidFilter) {
      throw new BadRequestException(
          "Invalid filter type for column type '%s'".formatted(filterTableColumn.getValueType()));
    }
  }

  private static void validateBooleanFilter(TableColumnFilterParameter filter) {
    if (filter instanceof BooleanFilterParameterDto booleanFilter
        && !booleanFilter.searchForTrue()
        && !booleanFilter.searchForFalse()
        && !booleanFilter.searchForNull()) {
      throw new BadRequestException("Invalid boolean filter: no search parameters");
    }
  }

  private static void validateDecimalRangeFilter(TableColumnFilterParameter filter) {
    if (filter instanceof DecimalRangeFilterParameterDto decimalRangeFilterParameter
        && decimalRangeFilterParameter
                .minValueInclusive()
                .compareTo(decimalRangeFilterParameter.maxValueInclusive())
            > 0) {
      throw new BadRequestException(
          "Invalid decimal range filter: minimal value greater than maximal value");
    }
  }

  private static void validateIntegerRangeFilter(TableColumnFilterParameter filter) {
    if (filter instanceof IntegerRangeFilterParameterDto integerRangeFilterParameter
        && integerRangeFilterParameter
                .minValueInclusive()
                .compareTo(integerRangeFilterParameter.maxValueInclusive())
            > 0) {
      throw new BadRequestException(
          "Invalid integer range filter: minimal value greater than maximal value");
    }
  }

  private static void validateValueOptionFilter(TableColumnFilterParameter filter) {
    if (filter instanceof ValueOptionFilterParameterDto valueOptionFilterParameter
        && valueOptionFilterParameter.searchValues().isEmpty()
        && !valueOptionFilterParameter.searchForNull()) {
      throw new BadRequestException("Invalid value option filter: no search parameters ");
    }
  }

  private static boolean filterDoesNotMatchColumn(
      TableColumnFilterParameter filter, TableColumn filterTableColumn) {
    if (filter instanceof NullFilterParameterDto) {
      return false;
    }

    return switch (filterTableColumn.getValueType()) {
      case BOOLEAN -> !(filter instanceof BooleanFilterParameterDto);
      case DATE, PROCEDURE_REFERENCE -> true;
      case DECIMAL ->
          !(filter instanceof DecimalRangeFilterParameterDto)
              && !(filter instanceof DecimalValueFilterParameterDto);
      case INTEGER ->
          !(filter instanceof IntegerRangeFilterParameterDto)
              && !(filter instanceof IntegerValueFilterParameterDto);
      case TEXT -> !(filter instanceof TextFilterParameterDto);
      case VALUE_WITH_OPTIONS -> !(filter instanceof ValueOptionFilterParameterDto);
    };
  }
}
