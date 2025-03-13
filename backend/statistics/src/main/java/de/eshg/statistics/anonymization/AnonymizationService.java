/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import de.eshg.statistics.aggregation.DataAggregationService;
import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.aggregation.ReportService;
import de.eshg.statistics.anonymization.interval.DecimalIntervalConfiguration;
import de.eshg.statistics.anonymization.interval.DecimalIntervalUtil;
import de.eshg.statistics.anonymization.interval.IntegerIntervalConfiguration;
import de.eshg.statistics.anonymization.interval.IntegerIntervalUtil;
import de.eshg.statistics.anonymization.interval.Interval;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnDataPrivacyCategory;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.entity.entry.TextEntry;
import de.eshg.statistics.persistence.entity.report.Report;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.deidentifier.arx.ARXConfiguration;
import org.deidentifier.arx.AttributeType;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.DataHandle;
import org.deidentifier.arx.DataType;
import org.deidentifier.arx.aggregates.HierarchyBuilderRedactionBased;
import org.deidentifier.arx.criteria.DistinctLDiversity;
import org.deidentifier.arx.criteria.KAnonymity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnonymizationService {
  private static final String ROW_ID_COLUMN = "id";
  private static final String NULL_NUMBER_VALUE_FOR_DATA = "NULL";

  private final EvaluationService evaluationService;
  private final ReportService reportService;
  private final DataAggregationService dataAggregationService;

  public AnonymizationService(
      EvaluationService evaluationService,
      ReportService reportService,
      DataAggregationService dataAggregationService) {
    this.evaluationService = evaluationService;
    this.reportService = reportService;
    this.dataAggregationService = dataAggregationService;
  }

  @Transactional(readOnly = true)
  public DataHolderBeforeAnonymization prepareAnonymization(
      UUID aggregationResultId, boolean isReport, int kAnonymizationLevel) {
    AbstractAggregationResult aggregationResult =
        getAggregationResult(aggregationResultId, isReport);
    return prepareAnonymization(aggregationResult, kAnonymizationLevel);
  }

  private AbstractAggregationResult getAggregationResult(UUID id, boolean isReport) {
    if (isReport) {
      return reportService.getReportInternal(id);
    } else {
      return evaluationService.getEvaluationInternal(id);
    }
  }

  private DataHolderBeforeAnonymization prepareAnonymization(
      AbstractAggregationResult aggregationResult, int kAnonymizationLevel) {
    if (getQuasiIdentifyingColumnStream(aggregationResult).findAny().isEmpty()) {
      return null;
    }

    ARXConfiguration config = ARXConfiguration.create();
    // todo kAnonymizationLevel should be stored in evaluation/report from business module
    config.addPrivacyModel(new KAnonymity(kAnonymizationLevel));

    Data.DefaultData data = Data.create();

    List<TableColumn> relevantTableColumns =
        getRelevantTableColumns(aggregationResult.getTableColumns());
    data.add(
        Stream.concat(
                Stream.of(ROW_ID_COLUMN),
                relevantTableColumns.stream().map(TableColumn::getSearchKey))
            .toArray(String[]::new));
    data.getDefinition().setAttributeType(ROW_ID_COLUMN, AttributeType.INSENSITIVE_ATTRIBUTE);
    data.getDefinition().setDataType(ROW_ID_COLUMN, DataType.INTEGER);

    // Todo DistinctLDiversity should be configured on the column?
    relevantTableColumns.stream()
        .filter(
            tableColumn ->
                TableColumnDataPrivacyCategory.SENSITIVE.equals(
                    getTableColumnDataPrivacyCategory(tableColumn)))
        .forEach(
            tableColumn ->
                config.addPrivacyModel(new DistinctLDiversity(tableColumn.getSearchKey(), 2)));

    Map<String, Interval<Number>> tableColumnSearchKeyToMinMaxInterval = new HashMap<>();
    relevantTableColumns.forEach(
        tableColumn ->
            configureColumn(tableColumn, data)
                .ifPresent(
                    minMaxInterval ->
                        tableColumnSearchKeyToMinMaxInterval.put(
                            tableColumn.getSearchKey(), minMaxInterval)));

    return new DataHolderBeforeAnonymization(
        aggregationResult.getExternalId(),
        aggregationResult instanceof Report,
        config,
        data,
        tableColumnSearchKeyToMinMaxInterval);
  }

  private static Stream<TableColumn> getQuasiIdentifyingColumnStream(
      AbstractAggregationResult aggregationResult) {
    return aggregationResult.getTableColumns().stream()
        .filter(
            tableColumn ->
                TableColumnDataPrivacyCategory.QUASI_IDENTIFYING.equals(
                    getTableColumnDataPrivacyCategory(tableColumn)));
  }

  private List<TableColumn> getRelevantTableColumns(List<TableColumn> tableColumns) {
    return tableColumns.stream()
        .filter(
            tableColumn -> {
              TableColumnDataPrivacyCategory category =
                  getTableColumnDataPrivacyCategory(tableColumn);
              if (category == null) {
                throw new IllegalStateException(
                    "Data privacy not configured %s".formatted(tableColumn.getSearchKey()));
              }
              // insensitive columns not relevant for anonymization
              return !category.equals(TableColumnDataPrivacyCategory.INSENSITIVE);
            })
        .toList();
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
    switch (Objects.requireNonNull(category)) {
      case SENSITIVE ->
          data.getDefinition()
              .setAttributeType(tableColumn.getSearchKey(), AttributeType.SENSITIVE_ATTRIBUTE);
      case QUASI_IDENTIFYING ->
          minMaxIntervalOptional = configureQuasiIdentifyingColumn(tableColumn, data);
      case INSENSITIVE ->
          throw new IllegalStateException(
              "Table column %s not relevant".formatted(tableColumn.getSearchKey()));
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
          throw new IllegalStateException(
              "Interval not configured for decimal %s".formatted(tableColumn.getSearchKey()));
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
          throw new IllegalStateException(
              "Interval not configured for integer %s".formatted(tableColumn.getSearchKey()));
        }
      }
      case BOOLEAN, DATE, TEXT, VALUE_WITH_OPTIONS -> configureTextColumn(tableColumn, data);
      case PROCEDURE_REFERENCE ->
          throw new IllegalStateException("Procedure reference should be insensitive");
      case DECIMAL_INTERVAL, INTEGER_INTERVAL ->
          throw new IllegalStateException(
              "Intervals are already anonymized: %s".formatted(tableColumn.getSearchKey()));
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
            minMaxNullUnknownValues.getMinDecimal(),
            minMaxNullUnknownValues.getMaxDecimal(),
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
            minMaxNullUnknownValues.getMinInteger(),
            minMaxNullUnknownValues.getMaxInteger(),
            intervalConfiguration);
    return minMaxIntervalOptional.orElse(null);
  }

  private static void configureTextColumn(TableColumn tableColumn, Data.DefaultData data) {
    HierarchyBuilderRedactionBased<?> builder = HierarchyBuilderRedactionBased.create('*');
    data.getDefinition().setAttributeType(tableColumn.getSearchKey(), builder);
  }

  @Transactional(readOnly = true)
  public boolean addTableRows(DataHolderBeforeAnonymization dataHolder, int page) {
    AbstractAggregationResult aggregationResult =
        getAggregationResult(dataHolder.id(), dataHolder.isReport());
    List<TableRow> tableRows =
        evaluationService.getTableRowPage(aggregationResult, page).getContent();

    Set<String> relevantSearchKeys =
        getRelevantTableColumns(aggregationResult.getTableColumns()).stream()
            .map(TableColumn::getSearchKey)
            .collect(Collectors.toSet());
    tableRows.forEach(
        tableRow ->
            dataHolder
                .data()
                .add(
                    Stream.concat(
                            Stream.of(String.valueOf(tableRow.getId())),
                            tableRow.getCellEntries().stream()
                                .filter(
                                    cellEntry ->
                                        relevantSearchKeys.contains(
                                            cellEntry.getTableColumn().getSearchKey()))
                                .map(
                                    cellEntry ->
                                        mapCellEntryValue(
                                            cellEntry,
                                            dataHolder
                                                .tableColumnSearchKeyToMinMaxInterval()
                                                .get(cellEntry.getTableColumn().getSearchKey()))))
                        .toArray(String[]::new)));

    return tableRows.isEmpty();
  }

  private static String mapCellEntryValue(
      CellEntry cellEntry, Interval<Number> minMaxIntervalOfColumn) {
    return switch (cellEntry) {
      case DecimalEntry decimalEntry ->
          getDecimalValueInInterval(
              decimalEntry.getBigDecimalValue(),
              getTableColumnDataPrivacyCategory(cellEntry.getTableColumn()),
              minMaxIntervalOfColumn);
      case IntegerEntry integerEntry ->
          getIntegerValueInInterval(
              integerEntry.getIntegerValue(),
              getTableColumnDataPrivacyCategory(cellEntry.getTableColumn()),
              minMaxIntervalOfColumn);
      default -> cellEntry.getValue() == null ? "" : cellEntry.getValue().toString();
    };
  }

  private static String getDecimalValueInInterval(
      BigDecimal value,
      TableColumnDataPrivacyCategory privacyCategory,
      Interval<Number> minMaxIntervalOfColumn) {
    if (TableColumnDataPrivacyCategory.QUASI_IDENTIFYING.equals(privacyCategory)) {
      // Values outside the interval have to be removed
      if (value == null
          || minMaxIntervalOfColumn == null
          || value.compareTo((BigDecimal) minMaxIntervalOfColumn.minInclusive()) < 0
          || value.compareTo((BigDecimal) minMaxIntervalOfColumn.maxExclusive()) > 0) {
        return NULL_NUMBER_VALUE_FOR_DATA;
      } else {
        return value.toPlainString();
      }
    } else {
      return value == null ? NULL_NUMBER_VALUE_FOR_DATA : value.toPlainString();
    }
  }

  private static String getIntegerValueInInterval(
      Integer value,
      TableColumnDataPrivacyCategory privacyCategory,
      Interval<Number> minMaxIntervalOfColumn) {
    if (TableColumnDataPrivacyCategory.QUASI_IDENTIFYING.equals(privacyCategory)) {
      // Values outside the interval have to be removed
      if (value == null
          || minMaxIntervalOfColumn == null
          || value < minMaxIntervalOfColumn.minInclusive().intValue()
          || value > minMaxIntervalOfColumn.maxExclusive().intValue()) {
        return NULL_NUMBER_VALUE_FOR_DATA;
      } else {
        return String.valueOf(value);
      }
    } else {
      return value == null ? NULL_NUMBER_VALUE_FOR_DATA : String.valueOf(value);
    }
  }

  static Map<Long, Integer> getRowIdToRowIndex(DataHandle dataHandle) {
    int rowIdColumnIndex = dataHandle.getColumnIndexOf(ROW_ID_COLUMN);
    Map<Long, Integer> rowIdToRowIndex = new HashMap<>();
    for (int row = 0; row < dataHandle.getNumRows(); row++) {
      try {
        long rowId = dataHandle.getLong(row, rowIdColumnIndex);
        rowIdToRowIndex.put(rowId, row);
      } catch (ParseException e) {
        throw new IllegalStateException(e);
      }
    }
    return rowIdToRowIndex;
  }

  @Transactional
  public void changeTableColumnValueTypes(DataHolderAfterAnonymization dataHolder) {
    AbstractAggregationResult aggregationResult =
        getAggregationResult(dataHolder.id(), dataHolder.isReport());

    getRelevantTableColumns(aggregationResult.getTableColumns())
        .forEach(tableColumn -> changeTableColumnValueType(tableColumn, dataHolder.dataHandle()));
  }

  private void changeTableColumnValueType(TableColumn tableColumn, DataHandle dataHandle) {
    TableColumnValueType valueTypeForInterval = null;
    if (tableColumn.getValueType().equals(TableColumnValueType.INTEGER)) {
      valueTypeForInterval = TableColumnValueType.INTEGER_INTERVAL;
    }
    if (tableColumn.getValueType().equals(TableColumnValueType.DECIMAL)) {
      valueTypeForInterval = TableColumnValueType.DECIMAL_INTERVAL;
    }
    if (valueTypeForInterval == null) {
      return;
    }
    if (dataHandle.getGeneralization(tableColumn.getSearchKey()) > 0) {
      tableColumn.setValueType(valueTypeForInterval);
    }
  }

  @Transactional
  public boolean storeAnonymizedData(DataHolderAfterAnonymization dataHolder, int page) {
    AbstractAggregationResult aggregationResult =
        getAggregationResult(dataHolder.id(), dataHolder.isReport());

    Set<String> quasiIdentifierSearchKeys =
        getQuasiIdentifyingColumnStream(aggregationResult)
            .map(TableColumn::getSearchKey)
            .collect(Collectors.toSet());

    List<TableRow> tableRows =
        evaluationService.getTableRowPage(aggregationResult, page).getContent();
    tableRows.forEach(
        tableRow -> {
          int rowIndex = dataHolder.rowIdToRowIndex().get(tableRow.getId());
          tableRow.getCellEntries().stream()
              .filter(
                  cellEntry ->
                      quasiIdentifierSearchKeys.contains(cellEntry.getTableColumn().getSearchKey()))
              .forEach(cellEntry -> updateCellEntry(cellEntry, rowIndex, dataHolder.dataHandle()));
        });

    return tableRows.isEmpty();
  }

  private void updateCellEntry(CellEntry cellEntry, int rowIndex, DataHandle dataHandle) {
    int columnIndex = dataHandle.getColumnIndexOf(cellEntry.getTableColumn().getSearchKey());
    String value = dataHandle.getValue(rowIndex, columnIndex).trim();

    switch (cellEntry.getTableColumn().getValueType()) {
      case BOOLEAN -> updateBooleanEntry((BooleanEntry) cellEntry, value);
      case DECIMAL -> updateDecimal((DecimalEntry) cellEntry, value);
      case DECIMAL_INTERVAL -> updateDecimalInterval((DecimalEntry) cellEntry, value);
      case INTEGER -> updateInteger((IntegerEntry) cellEntry, value);
      case INTEGER_INTERVAL -> updateIntegerInterval((IntegerEntry) cellEntry, value);
      case DATE, TEXT -> updateTextEntry((TextEntry) cellEntry, value);
      case VALUE_WITH_OPTIONS -> updateValueOption((TextEntry) cellEntry, value);
      case PROCEDURE_REFERENCE ->
          throw new IllegalStateException("Procedure reference should be insensitive");
    }
  }

  private static void updateBooleanEntry(BooleanEntry cellEntry, String value) {
    if (!"true".equalsIgnoreCase(value)
        && !"false".equalsIgnoreCase(value)
        && cellEntry.getValue() != null) {
      cellEntry.setBoolValue(null);
    }
  }

  private static void updateDecimal(DecimalEntry cellEntry, String value) {
    BigDecimal decimal = parseBigDecimal(value);
    cellEntry.setBigDecimalValue(decimal);
  }

  private static BigDecimal parseBigDecimal(String value) {
    try {
      return new BigDecimal(value);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private static void updateDecimalInterval(DecimalEntry cellEntry, String value) {
    if (isInterval(value)) {
      String[] split = value.split(",");
      BigDecimal lowerBound = parseBigDecimal(split[0].substring(1));
      BigDecimal upperBound = parseBigDecimal(split[1].substring(0, split[1].length() - 1));
      if (lowerBound == null || upperBound == null) {
        cellEntry.setBigDecimalValue(null);
      } else {
        BigDecimal average =
            lowerBound.add(upperBound).divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
        cellEntry.setBigDecimalValue(average);
        cellEntry.setDecimalLowerBound(lowerBound);
        cellEntry.setDecimalUpperBound(upperBound);
      }
    } else {
      BigDecimal decimal = parseBigDecimal(value);
      if (decimal == null) {
        cellEntry.setBigDecimalValue(null);
      } else {
        cellEntry.setBigDecimalValue(decimal);
        cellEntry.setDecimalLowerBound(decimal);
        cellEntry.setDecimalUpperBound(decimal);
      }
    }
  }

  private static boolean isInterval(String value) {
    return value.startsWith("[") && value.endsWith("]");
  }

  private static void updateInteger(IntegerEntry cellEntry, String value) {
    Integer integer = parseInteger(value);
    cellEntry.setIntegerValue(integer);
  }

  private static Integer parseInteger(String value) {
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private static void updateIntegerInterval(IntegerEntry cellEntry, String value) {
    if (isInterval(value)) {
      String[] split = value.split(",");
      Integer lowerBound = parseInteger(split[0].substring(1));
      Integer upperBound = parseInteger(split[1].substring(0, split[1].length() - 1));
      if (lowerBound == null || upperBound == null) {
        cellEntry.setIntegerValue(null);
      } else {
        Integer average = (upperBound + lowerBound) / 2;
        cellEntry.setIntegerValue(average);
        cellEntry.setIntegerLowerBound(lowerBound);
        cellEntry.setIntegerUpperBound(upperBound);
      }
    } else {
      Integer integer = parseInteger(value);
      if (integer == null) {
        cellEntry.setIntegerValue(null);
      } else {
        cellEntry.setIntegerValue(integer);
        cellEntry.setIntegerLowerBound(integer);
        cellEntry.setIntegerUpperBound(integer);
      }
    }
  }

  private static void updateTextEntry(TextEntry cellEntry, String value) {
    if (value.isEmpty()) {
      cellEntry.setTextValue(null);
    } else if (!value.equals(cellEntry.getValue())) {
      cellEntry.setTextValue(value);
    }
  }

  private static void updateValueOption(TextEntry cellEntry, String value) {
    if ((value.isEmpty() || !value.equals(cellEntry.getValue())) && cellEntry.getValue() != null) {
      cellEntry.setTextValue(null);
    }
  }

  @Transactional
  public void finishAnonymization(UUID id, boolean isReport, boolean redetermineNullUnknownValues) {
    AbstractAggregationResult aggregationResult = getAggregationResult(id, isReport);

    if (redetermineNullUnknownValues) {
      dataAggregationService.redetermineNullUnknownValues(
          getQuasiIdentifyingColumnStream(aggregationResult));
    }

    aggregationResult.setPendingState(AggregationResultPendingState.ANALYSIS_CONDUCTION);
  }
}
