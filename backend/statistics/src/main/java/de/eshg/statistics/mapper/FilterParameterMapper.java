/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.filter.BooleanFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NullFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NumericComparison;
import de.eshg.statistics.persistence.entity.filter.TextFilterParameter;
import de.eshg.statistics.persistence.entity.filter.ValueOptionFilterParameter;
import java.util.ArrayList;
import java.util.List;

public class FilterParameterMapper {
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
}
