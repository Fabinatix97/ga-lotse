/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.base.SortDirection;
import de.eshg.domain.model.BaseEntity_;
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
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.CellEntry_;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.TableRow_;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry_;
import de.eshg.statistics.persistence.entity.entry.DateEntry_;
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

public class AggregationResultSpecifications {
  private AggregationResultSpecifications() {}

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

  static Specification<TableRow> tableRowOfAggregationOrderByTableRowId(
      AbstractAggregationResult aggregationResult) {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.asc(root.get(BaseEntity_.ID)));
      return criteriaBuilder.equal(root.get(TableRow_.AGGREGATION_RESULT), aggregationResult);
    };
  }

  private static String getCellEntryValueColumn(TableColumn tableColumn) {
    return switch (tableColumn.getValueType()) {
      case BOOLEAN -> BooleanEntry_.BOOL_VALUE;
      case DATE -> DateEntry_.DATE_VALUE;
      case DECIMAL -> DecimalEntry_.BIG_DECIMAL_VALUE;
      case INTEGER -> IntegerEntry_.INTEGER_VALUE;
      case TEXT, VALUE_WITH_OPTIONS -> TextEntry_.TEXT_VALUE;
      case PROCEDURE_ID, CENTRAL_FILE_ID -> UuidEntry_.UUID_VALUE;
    };
  }

  static Specification<TableRow> createFilterSpecification(
      TableColumnFilterParameter filter, AbstractAggregationResult aggregationResult) {
    TableColumn tableColumn =
        AggregationResultUtil.getTableColumn(filter.attribute(), aggregationResult);

    return switch (filter) {
      case BooleanFilterParameterDto booleanFilterParameter ->
          getBooleanFilterSpecification(
              tableColumn,
              booleanFilterParameter.searchForTrue(),
              booleanFilterParameter.searchForFalse(),
              booleanFilterParameter.searchForNull());
      case DecimalRangeFilterParameterDto decimalRangeFilterParameter ->
          getDecimalRangeFilterSpecification(
              tableColumn,
              decimalRangeFilterParameter.minValueInclusive(),
              decimalRangeFilterParameter.maxValueInclusive(),
              decimalRangeFilterParameter.withNullValues());
      case DecimalValueFilterParameterDto decimalValueFilterParameter ->
          getDecimalValueFilterSpecification(
              tableColumn,
              decimalValueFilterParameter.value(),
              decimalValueFilterParameter.numericComparison(),
              decimalValueFilterParameter.withNullValues());
      case IntegerRangeFilterParameterDto integerRangeFilterParameter ->
          getIntegerRangeFilterSpecification(
              tableColumn,
              integerRangeFilterParameter.minValueInclusive(),
              integerRangeFilterParameter.maxValueInclusive(),
              integerRangeFilterParameter.withNullValues());
      case IntegerValueFilterParameterDto integerValueFilterParameter ->
          getIntegerValueFilterSpecification(
              tableColumn,
              integerValueFilterParameter.value(),
              integerValueFilterParameter.numericComparison(),
              integerValueFilterParameter.withNullValues());
      case NullFilterParameterDto ignored -> getNullSpecification(tableColumn);
      case TextFilterParameterDto textFilterParameter ->
          getTextFilterSpecification(tableColumn, textFilterParameter.text());
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
      TableColumn tableColumn,
      BigDecimal minValueInclusive,
      BigDecimal maxValueInclusive,
      boolean withNullValues) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      Path<BigDecimal> fieldPath = join.get(DecimalEntry_.BIG_DECIMAL_VALUE);

      Predicate tableColumnPredicate =
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

      return addAdditionalPredicatesForNumericRange(
          criteriaBuilder,
          fieldPath,
          minValueInclusive,
          maxValueInclusive,
          withNullValues,
          tableColumnPredicate);
    };
  }

  public static Specification<TableRow> getDecimalValueFilterSpecification(
      TableColumn tableColumn,
      BigDecimal value,
      NumericComparisonDto numericComparison,
      boolean withNullValues) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      Path<BigDecimal> fieldPath = join.get(DecimalEntry_.BIG_DECIMAL_VALUE);

      Predicate tableColumnPredicate =
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

      return addAdditionalPredicatesForNumericValue(
          criteriaBuilder,
          fieldPath,
          value,
          numericComparison,
          withNullValues,
          tableColumnPredicate);
    };
  }

  private static <T extends Comparable<? super T>> Predicate addAdditionalPredicatesForNumericRange(
      CriteriaBuilder criteriaBuilder,
      Path<T> fieldPath,
      T minValueInclusive,
      T maxValueInclusive,
      boolean withNullValues,
      Predicate tableColumnPredicate) {
    Predicate predicate =
        criteriaBuilder.and(
            criteriaBuilder.greaterThanOrEqualTo(fieldPath, minValueInclusive),
            criteriaBuilder.lessThanOrEqualTo(fieldPath, maxValueInclusive));

    if (withNullValues) {
      return criteriaBuilder.and(
          tableColumnPredicate, criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPath)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static <T extends Comparable<? super T>> Predicate addAdditionalPredicatesForNumericValue(
      CriteriaBuilder criteriaBuilder,
      Path<T> fieldPath,
      T value,
      NumericComparisonDto numericComparison,
      boolean withNullValues,
      Predicate tableColumnPredicate) {
    Predicate predicate =
        switch (numericComparison) {
          case EQUAL -> criteriaBuilder.equal(fieldPath, value);
          case GREATER_EQUAL -> criteriaBuilder.greaterThanOrEqualTo(fieldPath, value);
          case GREATER_THAN -> criteriaBuilder.greaterThan(fieldPath, value);
          case LESS_EQUAL -> criteriaBuilder.lessThanOrEqualTo(fieldPath, value);
          case LESS_THAN -> criteriaBuilder.lessThan(fieldPath, value);
        };

    if (withNullValues) {
      return criteriaBuilder.and(
          tableColumnPredicate, criteriaBuilder.or(predicate, criteriaBuilder.isNull(fieldPath)));
    } else {
      return criteriaBuilder.and(tableColumnPredicate, predicate);
    }
  }

  private static Specification<TableRow> getIntegerRangeFilterSpecification(
      TableColumn tableColumn,
      Integer minValueInclusive,
      Integer maxValueInclusive,
      boolean withNullValues) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      Path<Integer> fieldPath = join.get(IntegerEntry_.INTEGER_VALUE);

      Predicate tableColumnPredicate =
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

      return addAdditionalPredicatesForNumericRange(
          criteriaBuilder,
          fieldPath,
          minValueInclusive,
          maxValueInclusive,
          withNullValues,
          tableColumnPredicate);
    };
  }

  public static Specification<TableRow> getIntegerValueFilterSpecification(
      TableColumn tableColumn,
      Integer value,
      NumericComparisonDto numericComparison,
      boolean withNullValues) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      Path<Integer> fieldPath = join.get(IntegerEntry_.INTEGER_VALUE);

      Predicate tableColumnPredicate =
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn);

      return addAdditionalPredicatesForNumericValue(
          criteriaBuilder,
          fieldPath,
          value,
          numericComparison,
          withNullValues,
          tableColumnPredicate);
    };
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

  public static Specification<TableRow> getTextFilterSpecification(
      TableColumn tableColumn, String text) {
    return (root, query, criteriaBuilder) -> {
      Join<Object, Object> join = root.join(TableRow_.CELL_ENTRIES);
      return criteriaBuilder.and(
          criteriaBuilder.equal(join.get(CellEntry_.TABLE_COLUMN), tableColumn),
          criteriaBuilder.equal(join.get(TextEntry_.TEXT_VALUE), text));
    };
  }

  static Specification<TableRow> getValueOptionFilterSpecification(
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

  static Specification<TableRow> getNotNullAndNotUnknownSpecificationDecimalAndInteger(
      TableColumn tableColumn) {
    return switch (tableColumn.getValueType()) {
      case DECIMAL -> getNotNullAndNotUnknownSpecificationDecimal(tableColumn);
      case INTEGER -> getNotNullAndNotUnknownSpecificationInteger(tableColumn);
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

  static Specification<TableRow> getNotNullSpecification(TableColumn tableColumn) {
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
          criteriaBuilder.equal(join.get(DateEntry_.DATE_VALUE), date));
    };
  }
}
