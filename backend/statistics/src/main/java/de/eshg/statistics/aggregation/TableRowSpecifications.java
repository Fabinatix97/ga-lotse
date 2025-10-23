/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.api.commons.SortDirection;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.statistics.api.filter.BooleanFilterParameterDto;
import de.eshg.statistics.api.filter.DateFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalRangeFilterParameterDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerRangeFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NullFilterParameterDto;
import de.eshg.statistics.api.filter.RangeFilterParameterDto;
import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import de.eshg.statistics.api.filter.TextFilterParameterDto;
import de.eshg.statistics.api.filter.ValueFilterParameterDto;
import de.eshg.statistics.api.filter.ValueOptionFilterParameterDto;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.CellEntry_;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.TableRow_;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry_;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry_;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry_;
import de.eshg.statistics.persistence.entity.entry.TextEntry_;
import de.eshg.statistics.persistence.entity.entry.UuidEntry_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.EscapeCharacter;

public class TableRowSpecifications {
  private TableRowSpecifications() {}

  static Specification<TableRow> tableRowOfAggregationSortByColumn(
      TableColumn tableColumn, SortDirection sortDirection) {
    return (root, query, criteriaBuilder) -> {
      String cellEntryValueColumn = getCellEntryValueColumn(tableColumn);

      if (sortDirection.equals(SortDirection.ASC)) {
        query.orderBy(
            criteriaBuilder.asc(root.join(TableRow_.CELL_ENTRIES).get(cellEntryValueColumn)),
            criteriaBuilder.asc(root.get(BaseEntity_.ID)));
      } else {
        query.orderBy(
            criteriaBuilder.desc(root.join(TableRow_.CELL_ENTRIES).get(cellEntryValueColumn)),
            criteriaBuilder.desc(root.get(BaseEntity_.ID)));
      }

      return criteriaBuilder.and(
          criteriaBuilder.equal(
              root.get(TableRow_.CELL_ENTRIES).get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.equal(
              root.get(TableRow_.AGGREGATION_RESULT), tableColumn.getAggregationResult()));
    };
  }

  public static Specification<TableRow> tableRowOfAggregationOrderByTableRowId(
      AbstractAggregationResult aggregationResult) {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.asc(root.get(BaseEntity_.ID)));
      return criteriaBuilder.equal(root.get(TableRow_.AGGREGATION_RESULT), aggregationResult);
    };
  }

  private static String getCellEntryValueColumn(TableColumn tableColumn) {
    return switch (tableColumn.getValueType()) {
      case BOOLEAN -> BooleanEntry_.BOOL_VALUE;
      case DECIMAL, DECIMAL_INTERVAL -> DecimalEntry_.BIG_DECIMAL_VALUE;
      case INTEGER, INTEGER_INTERVAL -> IntegerEntry_.INTEGER_VALUE;
      case DATE, TEXT, VALUE_WITH_OPTIONS -> TextEntry_.TEXT_VALUE;
      case PROCEDURE_REFERENCE -> UuidEntry_.UUID_VALUE;
    };
  }

  public static Specification<TableRow> createFilterSpecification(
      TableColumnFilterParameter filter, AbstractAggregationResult aggregationResult) {
    TableColumn tableColumn =
        AggregationResultUtil.getTableColumnWithDto(filter.attribute(), aggregationResult);

    return switch (filter) {
      case BooleanFilterParameterDto booleanFilterParameter ->
          getBooleanFilterSpecification(
              tableColumn,
              booleanFilterParameter.searchForTrue(),
              booleanFilterParameter.searchForFalse(),
              booleanFilterParameter.searchForNull());
      case DateFilterParameterDto dateFilterParameter ->
          getTextSpecificationSearch(tableColumn, dateFilterParameter.date());
      case DecimalRangeFilterParameterDto decimalRangeFilterParameter ->
          getDecimalRangeFilterSpecification(tableColumn, decimalRangeFilterParameter);
      case DecimalValueFilterParameterDto decimalValueFilterParameter ->
          getDecimalValueFilterSpecification(tableColumn, decimalValueFilterParameter);
      case IntegerRangeFilterParameterDto integerRangeFilterParameter ->
          getIntegerRangeFilterSpecification(tableColumn, integerRangeFilterParameter);
      case IntegerValueFilterParameterDto integerValueFilterParameter ->
          getIntegerValueFilterSpecification(tableColumn, integerValueFilterParameter);
      case NullFilterParameterDto ignored -> getNullSpecification(tableColumn);
      case TextFilterParameterDto textFilterParameter ->
          getTextSpecificationSearch(tableColumn, textFilterParameter.text());
      case ValueOptionFilterParameterDto valueOptionFilterParameter ->
          getValueOptionFilterSpecification(
              tableColumn,
              valueOptionFilterParameter.searchValues(),
              valueOptionFilterParameter.searchForNull());
    };
  }

  private static Specification<TableRow> getBooleanFilterSpecification(
      TableColumn tableColumn,
      boolean searchForTrue,
      boolean searchForFalse,
      boolean searchForNull) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      Path<Boolean> fieldPath = join.get(BooleanEntry_.BOOL_VALUE);

      List<Predicate> predicates = new ArrayList<>();
      if (searchForTrue) {
        predicates.add(criteriaBuilder.equal(fieldPath, true));
      }
      if (searchForFalse) {
        predicates.add(criteriaBuilder.equal(fieldPath, false));
      }
      if (searchForNull) {
        predicates.add(criteriaBuilder.isNull(fieldPath));
      }

      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    };
  }

  private static Specification<TableRow> getDecimalRangeFilterSpecification(
      TableColumn tableColumn, RangeFilterParameterDto<BigDecimal> decimalRangeFilter) {
    if (tableColumn.getValueType().equals(TableColumnValueType.DECIMAL_INTERVAL)) {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericRangeInInterval(
            criteriaBuilder,
            join.get(DecimalEntry_.BIG_DECIMAL_VALUE),
            join.get(DecimalEntry_.DECIMAL_LOWER_BOUND),
            join.get(DecimalEntry_.DECIMAL_UPPER_BOUND),
            decimalRangeFilter,
            tableColumnPredicate);
      };
    } else {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Path<BigDecimal> fieldPath = join.get(DecimalEntry_.BIG_DECIMAL_VALUE);

        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericRange(
            criteriaBuilder, fieldPath, decimalRangeFilter, tableColumnPredicate);
      };
    }
  }

  public static Specification<TableRow> getDecimalValueFilterSpecification(
      TableColumn tableColumn, ValueFilterParameterDto<BigDecimal> decimalValueFilter) {
    if (tableColumn.getValueType().equals(TableColumnValueType.DECIMAL_INTERVAL)) {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericValueInInterval(
            criteriaBuilder,
            join.get(DecimalEntry_.BIG_DECIMAL_VALUE),
            join.get(DecimalEntry_.DECIMAL_LOWER_BOUND),
            join.get(DecimalEntry_.DECIMAL_UPPER_BOUND),
            decimalValueFilter,
            tableColumnPredicate);
      };
    } else {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Path<BigDecimal> fieldPath = join.get(DecimalEntry_.BIG_DECIMAL_VALUE);

        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericValue(
            criteriaBuilder, fieldPath, decimalValueFilter, tableColumnPredicate);
      };
    }
  }

  private static <N extends Comparable<? super N>>
      Predicate addAdditionalPredicatesForNumericRangeInInterval(
          CriteriaBuilder criteriaBuilder,
          Path<N> fieldPathValue,
          Path<N> fieldPathLowerBound,
          Path<N> fieldPathUpperBound,
          RangeFilterParameterDto<N> rangeFilter,
          Predicate tableColumnPredicate) {
    Predicate predicate =
        criteriaBuilder.and(
            criteriaBuilder.lessThanOrEqualTo(fieldPathLowerBound, rangeFilter.maxValueInclusive()),
            criteriaBuilder.greaterThanOrEqualTo(
                fieldPathUpperBound, rangeFilter.minValueInclusive()));

    if (rangeFilter.withNullValues()) {
      return criteriaBuilder.and(
          tableColumnPredicate,
          criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPathValue)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static <N extends Comparable<? super N>> Predicate addAdditionalPredicatesForNumericRange(
      CriteriaBuilder criteriaBuilder,
      Path<N> fieldPath,
      RangeFilterParameterDto<N> rangeFilter,
      Predicate tableColumnPredicate) {
    Predicate predicate =
        criteriaBuilder.and(
            criteriaBuilder.greaterThanOrEqualTo(fieldPath, rangeFilter.minValueInclusive()),
            criteriaBuilder.lessThanOrEqualTo(fieldPath, rangeFilter.maxValueInclusive()));

    if (rangeFilter.withNullValues()) {
      return criteriaBuilder.and(
          tableColumnPredicate, criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPath)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static <N extends Comparable<? super N>>
      Predicate addAdditionalPredicatesForNumericValueInInterval(
          CriteriaBuilder criteriaBuilder,
          Path<N> fieldPathValue,
          Path<N> fieldPathLowerBound,
          Path<N> fieldPathUpperBound,
          ValueFilterParameterDto<N> valueFilter,
          Predicate tableColumnPredicate) {
    N value = valueFilter.value();
    Predicate predicate =
        switch (valueFilter.numericComparison()) {
          case EQUAL ->
              criteriaBuilder.and(
                  criteriaBuilder.lessThanOrEqualTo(fieldPathLowerBound, value),
                  criteriaBuilder.greaterThanOrEqualTo(fieldPathUpperBound, value));
          case GREATER_EQUAL -> criteriaBuilder.lessThanOrEqualTo(fieldPathLowerBound, value);
          case GREATER_THAN -> criteriaBuilder.lessThan(fieldPathLowerBound, value);
          case LESS_EQUAL -> criteriaBuilder.greaterThanOrEqualTo(fieldPathUpperBound, value);
          case LESS_THAN -> criteriaBuilder.greaterThan(fieldPathUpperBound, value);
        };

    if (valueFilter.withNullValues()) {
      return criteriaBuilder.and(
          tableColumnPredicate,
          criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPathValue)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static <N extends Comparable<? super N>> Predicate addAdditionalPredicatesForNumericValue(
      CriteriaBuilder criteriaBuilder,
      Path<N> fieldPath,
      ValueFilterParameterDto<N> valueFilter,
      Predicate tableColumnPredicate) {
    N value = valueFilter.value();
    Predicate predicate =
        switch (valueFilter.numericComparison()) {
          case EQUAL -> criteriaBuilder.equal(fieldPath, value);
          case GREATER_EQUAL -> criteriaBuilder.greaterThanOrEqualTo(fieldPath, value);
          case GREATER_THAN -> criteriaBuilder.greaterThan(fieldPath, value);
          case LESS_EQUAL -> criteriaBuilder.lessThanOrEqualTo(fieldPath, value);
          case LESS_THAN -> criteriaBuilder.lessThan(fieldPath, value);
        };

    if (valueFilter.withNullValues()) {
      return criteriaBuilder.and(
          tableColumnPredicate, criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPath)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static Specification<TableRow> getIntegerRangeFilterSpecification(
      TableColumn tableColumn, RangeFilterParameterDto<Integer> integerRangeFilter) {
    if (tableColumn.getValueType().equals(TableColumnValueType.INTEGER_INTERVAL)) {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericRangeInInterval(
            criteriaBuilder,
            join.get(IntegerEntry_.INTEGER_VALUE),
            join.get(IntegerEntry_.INTEGER_LOWER_BOUND),
            join.get(IntegerEntry_.INTEGER_UPPER_BOUND),
            integerRangeFilter,
            tableColumnPredicate);
      };
    } else {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Path<Integer> fieldPath = join.get(IntegerEntry_.INTEGER_VALUE);

        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericRange(
            criteriaBuilder, fieldPath, integerRangeFilter, tableColumnPredicate);
      };
    }
  }

  public static Specification<TableRow> getIntegerValueFilterSpecification(
      TableColumn tableColumn, ValueFilterParameterDto<Integer> integerValueFilter) {
    if (tableColumn.getValueType().equals(TableColumnValueType.INTEGER_INTERVAL)) {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericValueInInterval(
            criteriaBuilder,
            join.get(IntegerEntry_.INTEGER_VALUE),
            join.get(IntegerEntry_.INTEGER_LOWER_BOUND),
            join.get(IntegerEntry_.INTEGER_UPPER_BOUND),
            integerValueFilter,
            tableColumnPredicate);
      };
    } else {
      return (root, query, criteriaBuilder) -> {
        Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
        Path<Integer> fieldPath = join.get(IntegerEntry_.INTEGER_VALUE);

        Predicate tableColumnPredicate =
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

        return addAdditionalPredicatesForNumericValue(
            criteriaBuilder, fieldPath, integerValueFilter, tableColumnPredicate);
      };
    }
  }

  public static Specification<TableRow> getNullSpecification(TableColumn tableColumn) {
    String cellEntryValueColumn = getCellEntryValueColumn(tableColumn);
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.isNull(join.get(cellEntryValueColumn)));
    };
  }

  public static Specification<TableRow> getTextFilterSpecificationExactly(
      TableColumn tableColumn, String text) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.equal(join.get(TextEntry_.TEXT_VALUE), text));
    };
  }

  public static Specification<TableRow> getTextSpecificationSearch(
      TableColumn tableColumn, String text) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.like(
              criteriaBuilder.lower(join.get(TextEntry_.TEXT_VALUE)),
              "%" + EscapeCharacter.DEFAULT.escape(text.toLowerCase()) + "%",
              EscapeCharacter.DEFAULT.getEscapeCharacter()));
    };
  }

  public static Specification<TableRow> getValueOptionFilterSpecification(
      TableColumn tableColumn, List<String> valuesList, boolean searchForNull) {
    Set<String> values = new HashSet<>(valuesList);
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);

      List<Predicate> predicates = new ArrayList<>();
      values.forEach(
          value -> predicates.add(criteriaBuilder.equal(join.get(TextEntry_.TEXT_VALUE), value)));
      if (searchForNull) {
        predicates.add(criteriaBuilder.isNull(join.get(TextEntry_.TEXT_VALUE)));
      }

      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    };
  }

  public static Specification<TableRow> getNotNullAndNotUnknownSpecificationDecimalAndInteger(
      TableColumn tableColumn) {
    return switch (tableColumn.getValueType()) {
      case DECIMAL, DECIMAL_INTERVAL -> getNotNullAndNotUnknownSpecificationDecimal(tableColumn);
      case INTEGER, INTEGER_INTERVAL -> getNotNullAndNotUnknownSpecificationInteger(tableColumn);
      default -> throw new IllegalStateException("Unexpected value: " + tableColumn.getValueType());
    };
  }

  private static Specification<TableRow> getNotNullAndNotUnknownSpecificationDecimal(
      TableColumn tableColumn) {
    BigDecimal unknownValue =
        tableColumn.getMinMaxNullUnknownValues().getUnknownValue() == null
            ? null
            : new BigDecimal(tableColumn.getMinMaxNullUnknownValues().getUnknownValue());
    return getNotNullAndNotUnknownSpecification(
        tableColumn, unknownValue, DecimalEntry_.BIG_DECIMAL_VALUE);
  }

  private static Specification<TableRow> getNotNullAndNotUnknownSpecificationInteger(
      TableColumn tableColumn) {
    Integer unknownValue =
        tableColumn.getMinMaxNullUnknownValues().getUnknownValue() == null
            ? null
            : Integer.parseInt(tableColumn.getMinMaxNullUnknownValues().getUnknownValue());
    return getNotNullAndNotUnknownSpecification(
        tableColumn, unknownValue, IntegerEntry_.INTEGER_VALUE);
  }

  private static Specification<TableRow> getNotNullAndNotUnknownSpecification(
      TableColumn tableColumn, Object unknownValue, String field) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      if (unknownValue == null) {
        return criteriaBuilder.and(
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
            criteriaBuilder.isNotNull(join.get(field)));
      } else {
        return criteriaBuilder.and(
            criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
            criteriaBuilder.notEqual(join.get(field), unknownValue),
            criteriaBuilder.isNotNull(join.get(field)));
      }
    };
  }

  public static Specification<TableRow> getNotNullSpecification(TableColumn tableColumn) {
    String cellEntryValueColumn = getCellEntryValueColumn(tableColumn);
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.isNotNull(join.get(cellEntryValueColumn)));
    };
  }

  public static Specification<TableRow> getEqualDateSpecification(
      TableColumn tableColumn, LocalDate date) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.equal(join.get(TextEntry_.TEXT_VALUE), date.toString()));
    };
  }
}
