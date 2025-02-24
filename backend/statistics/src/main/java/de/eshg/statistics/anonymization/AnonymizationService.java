/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.anonymization.interval.DecimalIntervalConfiguration;
import de.eshg.statistics.anonymization.interval.DecimalIntervalUtil;
import de.eshg.statistics.anonymization.interval.IntegerIntervalConfiguration;
import de.eshg.statistics.anonymization.interval.IntegerIntervalUtil;
import de.eshg.statistics.anonymization.interval.Interval;
import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnDataPrivacyCategory;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.deidentifier.arx.ARXConfiguration;
import org.deidentifier.arx.AttributeType;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.aggregates.HierarchyBuilderRedactionBased;
import org.deidentifier.arx.criteria.DistinctLDiversity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnonymizationService {
  private static final String ROW_ID_COLUMN = "id";
  private static final String NULL_NUMBER_VALUE_FOR_DATA = "NULL";

  private final EvaluationService evaluationService;

  public AnonymizationService(EvaluationService evaluationService) {
    this.evaluationService = evaluationService;
  }

  @Transactional
  public Map<String, Interval<Number>> prepareAnonymization(
      UUID evaluationId, ARXConfiguration config, Data.DefaultData data) {
    Evaluation evaluation = evaluationService.getEvaluationInternal(evaluationId);
    List<TableColumn> tableColumns = evaluation.getTableColumns();

    data.add(
        Stream.concat(
                Stream.of(ROW_ID_COLUMN), tableColumns.stream().map(TableColumn::getSearchKey))
            .toArray(String[]::new));
    data.getDefinition().setAttributeType(ROW_ID_COLUMN, AttributeType.INSENSITIVE_ATTRIBUTE);

    // Todo DistinctLDiversity should be configured on the column?
    tableColumns.stream()
        .filter(
            tableColumn ->
                TableColumnDataPrivacyCategory.SENSITIVE.equals(
                    getTableColumnDataPrivacyCategory(tableColumn)))
        .forEach(
            tableColumn ->
                config.addPrivacyModel(new DistinctLDiversity(tableColumn.getSearchKey(), 2)));

    Map<String, Interval<Number>> tableColumnSearchKeyToMaxInterval = new HashMap<>();
    tableColumns.forEach(
        tableColumn ->
            configureColumn(tableColumn, data)
                .ifPresent(
                    minMaxInterval ->
                        tableColumnSearchKeyToMaxInterval.put(
                            tableColumn.getSearchKey(), minMaxInterval)));

    return tableColumnSearchKeyToMaxInterval;
  }

  private static TableColumnDataPrivacyCategory getTableColumnDataPrivacyCategory(
      TableColumn tableColumn) {
    return tableColumn.getAnonymizationConfiguration() == null
        ? null
        : tableColumn.getAnonymizationConfiguration().getDataPrivacyCategory();
  }

  private static Optional<Interval<Number>> configureColumn(
      TableColumn tableColumn, Data.DefaultData data) {
    Optional<Interval<Number>> minMaxIntervalOptional = Optional.empty();
    TableColumnDataPrivacyCategory category = getTableColumnDataPrivacyCategory(tableColumn);
    switch (category) {
        // Todo errorhandling
      case null -> throw new IllegalStateException("Not configured");
      case SENSITIVE ->
          data.getDefinition()
              .setAttributeType(tableColumn.getSearchKey(), AttributeType.SENSITIVE_ATTRIBUTE);
      case INSENSITIVE ->
          data.getDefinition()
              .setAttributeType(tableColumn.getSearchKey(), AttributeType.INSENSITIVE_ATTRIBUTE);
      case QUASI_IDENTIFYING ->
          minMaxIntervalOptional = configureQuasiIdentifyingColumn(tableColumn, data);
    }
    return minMaxIntervalOptional;
  }

  private static Optional<Interval<Number>> configureQuasiIdentifyingColumn(
      TableColumn tableColumn, Data.DefaultData data) {
    MinMaxNullUnknownValues minMaxNullUnknownValues = tableColumn.getMinMaxNullUnknownValues();
    AnonymizationConfiguration anonymizationConfiguration =
        tableColumn.getAnonymizationConfiguration();

    Interval<Number> minMaxInterval = null;
    switch (tableColumn.getValueType()) {
      case DECIMAL -> {
        DecimalIntervalConfiguration intervalConfiguration =
            DecimalIntervalUtil.createIntervalConfiguration(anonymizationConfiguration);
        if (intervalConfiguration != null) {
          minMaxInterval =
              configureDecimalColumn(
                  tableColumn, data, minMaxNullUnknownValues, intervalConfiguration);
        } else {
          // Todo errorhandling
          throw new IllegalStateException("Not configured decimal");
        }
      }
      case INTEGER -> {
        IntegerIntervalConfiguration intervalConfiguration =
            IntegerIntervalUtil.createIntervalConfiguration(anonymizationConfiguration);
        if (intervalConfiguration != null) {
          minMaxInterval =
              configureIntegerColumn(
                  tableColumn, data, minMaxNullUnknownValues, intervalConfiguration);
        } else {
          // Todo errorhandling
          throw new IllegalStateException("Not configured integer");
        }
      }
      case BOOLEAN, DATE, TEXT, VALUE_WITH_OPTIONS -> configureTextColumn(tableColumn, data);
      case PROCEDURE_REFERENCE ->
          throw new IllegalStateException("Procedure reference should be insensitive");
    }

    return minMaxInterval == null ? Optional.empty() : Optional.of(minMaxInterval);
  }

  private static Interval<Number> configureDecimalColumn(
      TableColumn tableColumn,
      Data.DefaultData data,
      MinMaxNullUnknownValues minMaxNullUnknownValues,
      DecimalIntervalConfiguration intervalConfiguration) {
    Optional<Interval<Number>> minMaxIntervalOptional =
        DecimalIntervalUtil.configureColumn(
            data,
            tableColumn.getSearchKey(),
            minMaxNullUnknownValues == null ? null : minMaxNullUnknownValues.getMinDecimal(),
            minMaxNullUnknownValues == null ? null : minMaxNullUnknownValues.getMaxDecimal(),
            intervalConfiguration);
    return minMaxIntervalOptional.orElse(null);
  }

  private static Interval<Number> configureIntegerColumn(
      TableColumn tableColumn,
      Data.DefaultData data,
      MinMaxNullUnknownValues minMaxNullUnknownValues,
      IntegerIntervalConfiguration intervalConfiguration) {
    Optional<Interval<Number>> minMaxIntervalOptional =
        IntegerIntervalUtil.configureColumn(
            data,
            tableColumn.getSearchKey(),
            minMaxNullUnknownValues == null ? null : minMaxNullUnknownValues.getMinInteger(),
            minMaxNullUnknownValues == null ? null : minMaxNullUnknownValues.getMaxInteger(),
            intervalConfiguration);
    return minMaxIntervalOptional.orElse(null);
  }

  private static void configureTextColumn(TableColumn tableColumn, Data.DefaultData data) {
    HierarchyBuilderRedactionBased<?> builder =
        HierarchyBuilderRedactionBased.create(
            HierarchyBuilderRedactionBased.Order.RIGHT_TO_LEFT,
            HierarchyBuilderRedactionBased.Order.RIGHT_TO_LEFT,
            ' ',
            '*');
    data.getDefinition().setAttributeType(tableColumn.getSearchKey(), builder);
  }

  @Transactional
  public boolean addTableRows(
      UUID evaluationId,
      int page,
      Data.DefaultData data,
      Map<String, Interval<Number>> tableColumnSearchKeyToMaxInterval) {
    Evaluation evaluationInternal = evaluationService.getEvaluationInternal(evaluationId);

    List<TableRow> tableRows =
        evaluationService.getTableRowPage(evaluationInternal, page).getContent();

    tableRows.forEach(
        tableRow ->
            data.add(
                Stream.concat(
                        Stream.of(String.valueOf(tableRow.getId())),
                        tableRow.getCellEntries().stream()
                            .map(
                                cellEntry ->
                                    mapCellEntryValue(
                                        cellEntry,
                                        tableColumnSearchKeyToMaxInterval.get(
                                            cellEntry.getTableColumn().getSearchKey()))))
                    .toArray(String[]::new)));

    return tableRows.isEmpty();
  }

  private String mapCellEntryValue(CellEntry cellEntry, Interval<Number> numberIntervalOfColumn) {
    return switch (cellEntry.getTableColumn().getValueType()) {
      case DECIMAL ->
          getDecimalValueInInterval(
              ((DecimalEntry) cellEntry).getBigDecimalValue(), numberIntervalOfColumn);
      case INTEGER ->
          getIntegerValueInInterval(
              ((IntegerEntry) cellEntry).getIntegerValue(), numberIntervalOfColumn);
      case BOOLEAN, DATE, PROCEDURE_REFERENCE, TEXT, VALUE_WITH_OPTIONS ->
          cellEntry.getValue() == null ? "" : cellEntry.getValue().toString();
    };
  }

  /*
   * Values outside the interval have to be removed
   */
  private String getDecimalValueInInterval(
      BigDecimal value, Interval<Number> numberIntervalOfColumn) {
    if (value == null
        || numberIntervalOfColumn == null
        || value.compareTo((BigDecimal) numberIntervalOfColumn.minInclusive()) < 0
        || value.compareTo((BigDecimal) numberIntervalOfColumn.maxExclusive()) > 0) {
      return NULL_NUMBER_VALUE_FOR_DATA;
    }
    return value.toPlainString();
  }

  /*
   * Values outside the interval have to be removed
   */
  private String getIntegerValueInInterval(Integer value, Interval<Number> numberIntervalOfColumn) {
    if (value == null
        || numberIntervalOfColumn == null
        || value < numberIntervalOfColumn.minInclusive().intValue()
        || value > numberIntervalOfColumn.maxExclusive().intValue()) {
      return NULL_NUMBER_VALUE_FOR_DATA;
    }
    return String.valueOf(value);
  }
}
