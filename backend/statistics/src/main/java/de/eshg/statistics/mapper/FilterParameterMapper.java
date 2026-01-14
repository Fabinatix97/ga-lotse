/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DateFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.datatransfer.FilterInformationData;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.filter.BooleanFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DateFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NullFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NumericComparison;
import de.eshg.statistics.persistence.entity.filter.TextFilterParameter;
import de.eshg.statistics.persistence.entity.filter.ValueOptionFilterParameter;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;
import org.hibernate.Hibernate;

public class FilterParameterMapper {
  public static final String INTERVAL_FORMAT_STRING = "[%s;%s]";
  private static final String SEARCH_FOR_NULL_DESCRIPTION = "leere Felder";

  private FilterParameterMapper() {}

  public static AbstractFilterParameter mapToPersistence(TableColumnFilterParameter filter) {
    return switch (filter) {
      case BooleanFilterParameterDto filterParameterDto -> {
        BooleanFilterParameter filterPersistence = new BooleanFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setSearchForTrue(filterParameterDto.searchForTrue());
        filterPersistence.setSearchForFalse(filterParameterDto.searchForFalse());
        filterPersistence.setSearchForNull(filterParameterDto.searchForNull());
        yield filterPersistence;
      }
      case DateFilterParameterDto filterParameterDto -> {
        DateFilterParameter filterPersistence = new DateFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setValue(filterParameterDto.date());
        yield filterPersistence;
      }
      case DecimalRangeFilterParameterDto filterParameterDto -> {
        DecimalRangeFilterParameter filterPersistence = new DecimalRangeFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setMinValueInclusive(filterParameterDto.minValueInclusive());
        filterPersistence.setMaxValueInclusive(filterParameterDto.maxValueInclusive());
        filterPersistence.setWithNullValues(filterParameterDto.withNullValues());
        yield filterPersistence;
      }
      case DecimalValueFilterParameterDto filterParameterDto -> {
        DecimalValueFilterParameter filterPersistence = new DecimalValueFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setValue(filterParameterDto.value());
        filterPersistence.setNumericComparison(
            mapToNumericComparison(filterParameterDto.numericComparison()));
        filterPersistence.setWithNullValues(filterParameterDto.withNullValues());
        yield filterPersistence;
      }
      case IntegerRangeFilterParameterDto filterParameterDto -> {
        IntegerRangeFilterParameter filterPersistence = new IntegerRangeFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setMinValueInclusive(filterParameterDto.minValueInclusive());
        filterPersistence.setMaxValueInclusive(filterParameterDto.maxValueInclusive());
        filterPersistence.setWithNullValues(filterParameterDto.withNullValues());
        yield filterPersistence;
      }
      case IntegerValueFilterParameterDto filterParameterDto -> {
        IntegerValueFilterParameter filterPersistence = new IntegerValueFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setValue(filterParameterDto.value());
        filterPersistence.setNumericComparison(
            mapToNumericComparison(filterParameterDto.numericComparison()));
        filterPersistence.setWithNullValues(filterParameterDto.withNullValues());
        yield filterPersistence;
      }
      case NullFilterParameterDto filterParameterDto -> {
        NullFilterParameter filterPersistence = new NullFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        yield filterPersistence;
      }
      case TextFilterParameterDto filterParameterDto -> {
        TextFilterParameter filterPersistence = new TextFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.setValue(filterParameterDto.text());
        yield filterPersistence;
      }
      case ValueOptionFilterParameterDto filterParameterDto -> {
        ValueOptionFilterParameter filterPersistence = new ValueOptionFilterParameter();
        filterPersistence.setAttributeSelection(
            AttributeSelectionMapper.mapToPersistence(filterParameterDto.attribute()));
        filterPersistence.addSearchValues(filterParameterDto.searchValues());
        filterPersistence.setSearchForNull(filterParameterDto.searchForNull());
        yield filterPersistence;
      }
    };
  }

  private static NumericComparison mapToNumericComparison(NumericComparisonDto numericComparison) {
    return NumericComparison.valueOf(numericComparison.name());
  }

  public static List<TableColumnFilterParameter> mapToApi(List<AbstractFilterParameter> filters) {
    return filters.stream().map(FilterParameterMapper::mapToApi).toList();
  }

  private static TableColumnFilterParameter mapToApi(
      AbstractFilterParameter abstractFilterParameter) {
    AttributeSelectionDto attribute =
        AttributeSelectionMapper.mapToApi(abstractFilterParameter.getAttributeSelection(), true);
    return switch (abstractFilterParameter) {
      case BooleanFilterParameter filterParameter ->
          new BooleanFilterParameterDto(
              attribute,
              filterParameter.isSearchForTrue(),
              filterParameter.isSearchForFalse(),
              filterParameter.isSearchForNull());
      case DateFilterParameter filterParameter ->
          new DateFilterParameterDto(attribute, filterParameter.getValue());
      case DecimalRangeFilterParameter filterParameter ->
          new DecimalRangeFilterParameterDto(
              attribute,
              filterParameter.getMinValueInclusive(),
              filterParameter.getMaxValueInclusive(),
              filterParameter.isWithNullValues());
      case DecimalValueFilterParameter filterParameter ->
          new DecimalValueFilterParameterDto(
              attribute,
              filterParameter.getValue(),
              mapToNumericComparisonDto(filterParameter.getNumericComparison()),
              filterParameter.isWithNullValues());
      case IntegerRangeFilterParameter filterParameter ->
          new IntegerRangeFilterParameterDto(
              attribute,
              filterParameter.getMinValueInclusive(),
              filterParameter.getMaxValueInclusive(),
              filterParameter.isWithNullValues());
      case IntegerValueFilterParameter filterParameter ->
          new IntegerValueFilterParameterDto(
              attribute,
              filterParameter.getValue(),
              mapToNumericComparisonDto(filterParameter.getNumericComparison()),
              filterParameter.isWithNullValues());
      case NullFilterParameter ignored -> new NullFilterParameterDto(attribute);
      case TextFilterParameter filterParameter ->
          new TextFilterParameterDto(attribute, filterParameter.getValue());
      case ValueOptionFilterParameter filterParameter ->
          new ValueOptionFilterParameterDto(
              attribute,
              new ArrayList<>(filterParameter.getSearchValues()),
              filterParameter.isSearchForNull());
      default -> throw new IllegalStateException("Unexpected value: " + abstractFilterParameter);
    };
  }

  private static NumericComparisonDto mapToNumericComparisonDto(
      NumericComparison numericComparison) {
    return NumericComparisonDto.valueOf(numericComparison.name());
  }

  public static List<String> mapToFilterLabels(
      List<TableColumn> tableColumns, List<AbstractFilterParameter> filters) {
    return filters.stream()
        .map(
            filter -> {
              FilterInformationData filterInformationData =
                  mapToAttributeLabelWithFilterInformation(
                      Hibernate.unproxy(filter, AbstractFilterParameter.class), tableColumns);
              return "%s: %s"
                  .formatted(
                      filterInformationData.attributeLabel(),
                      filterInformationData.filterInformation());
            })
        .toList();
  }

  public static FilterInformationData mapToAttributeLabelWithFilterInformation(
      AbstractFilterParameter filter, List<TableColumn> tableColumns) {
    String searchKey = AttributeSelectionMapper.buildSearchKey(filter.getAttributeSelection());
    TableColumn tableColumn =
        tableColumns.stream()
            .filter(column -> column.getSearchKey().equals(searchKey))
            .findFirst()
            .orElseThrow(
                () -> new IllegalStateException("No tableColumn %s found".formatted(searchKey)));

    String filterInfo =
        switch (filter) {
          case BooleanFilterParameter filterParameter -> mapToFilterInformation(filterParameter);
          case DateFilterParameter filterParameter -> filterParameter.getValue();
          case DecimalRangeFilterParameter filterParameter ->
              mapToIntervalFilterInformation(
                  getBigDecimalAsString(filterParameter.getMinValueInclusive()),
                  getBigDecimalAsString(filterParameter.getMaxValueInclusive()),
                  filterParameter.isWithNullValues());
          case DecimalValueFilterParameter filterParameter ->
              mapToNumberValueFilterInformation(
                  getBigDecimalAsString(filterParameter.getValue()),
                  filterParameter.getNumericComparison(),
                  filterParameter.isWithNullValues());
          case IntegerRangeFilterParameter filterParameter ->
              mapToIntervalFilterInformation(
                  "%s".formatted(filterParameter.getMinValueInclusive()),
                  "%s".formatted(filterParameter.getMaxValueInclusive()),
                  filterParameter.isWithNullValues());
          case IntegerValueFilterParameter filterParameter ->
              mapToNumberValueFilterInformation(
                  "%s".formatted(filterParameter.getValue()),
                  filterParameter.getNumericComparison(),
                  filterParameter.isWithNullValues());
          case NullFilterParameter ignored -> SEARCH_FOR_NULL_DESCRIPTION;
          case TextFilterParameter filterParameter -> filterParameter.getValue();
          case ValueOptionFilterParameter filterParameter ->
              mapToFilterInformation(filterParameter, tableColumn);
          default -> throw new IllegalStateException("Unexpected value: " + filter.getClass());
        };
    return new FilterInformationData(
        EvaluationMapper.getAttributeDisplayName(tableColumn, true), filterInfo);
  }

  private static String mapToFilterInformation(BooleanFilterParameter filterParameter) {
    List<String> searchValues = new ArrayList<>();
    if (filterParameter.isSearchForTrue()) {
      searchValues.add("Ja");
    }
    if (filterParameter.isSearchForFalse()) {
      searchValues.add("Nein");
    }
    if (filterParameter.isSearchForNull()) {
      searchValues.add(SEARCH_FOR_NULL_DESCRIPTION);
    }
    return concatFilterValues(searchValues);
  }

  public static String getBigDecimalAsString(BigDecimal decimal) {
    NumberFormat numberFormat = NumberFormat.getInstance(Locale.GERMAN);
    numberFormat.setGroupingUsed(false);
    numberFormat.setMaximumFractionDigits(4);
    return numberFormat.format(decimal.doubleValue());
  }

  private static String mapToIntervalFilterInformation(
      String minInclusive, String maxInclusive, boolean withNullValues) {
    String filterInformation = INTERVAL_FORMAT_STRING.formatted(minInclusive, maxInclusive);
    if (withNullValues) {
      return concatFilterValues(List.of(filterInformation, SEARCH_FOR_NULL_DESCRIPTION));
    } else {
      return filterInformation;
    }
  }

  private static String mapToNumberValueFilterInformation(
      String value, NumericComparison numericComparison, boolean withNullValues) {
    String filterInformation =
        "%s %s"
            .formatted(
                switch (numericComparison) {
                  case EQUAL -> "=";
                  case GREATER_EQUAL -> ">=";
                  case GREATER_THAN -> ">";
                  case LESS_EQUAL -> "<=";
                  case LESS_THAN -> "<";
                },
                value);

    if (withNullValues) {
      return concatFilterValues(List.of(filterInformation, SEARCH_FOR_NULL_DESCRIPTION));
    } else {
      return filterInformation;
    }
  }

  private static String mapToFilterInformation(
      ValueOptionFilterParameter filterParameter, TableColumn tableColumn) {
    Stream<String> meaningStream =
        filterParameter.getSearchValues().stream()
            .map(value -> mapToMeaning(value, tableColumn.getValueToMeanings()));
    if (filterParameter.isSearchForNull()) {
      meaningStream = Stream.concat(meaningStream, Stream.of(SEARCH_FOR_NULL_DESCRIPTION));
    }
    return concatFilterValues(meaningStream.toList());
  }

  private static String mapToMeaning(String value, List<ValueToMeaning> valueToMeanings) {
    return valueToMeanings.stream()
        .filter(v -> v.getValue().equals(value))
        .map(ValueToMeaning::getMeaning)
        .findFirst()
        .orElse(value);
  }

  private static String concatFilterValues(List<String> filterValues) {
    return String.join(", ", filterValues);
  }
}
