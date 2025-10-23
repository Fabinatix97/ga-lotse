/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.statistics.api.AttributesInformation;
import de.eshg.statistics.api.TableColumnHeader;
import de.eshg.statistics.api.attributes.AbstractTableColumnHeaderAttribute;
import de.eshg.statistics.api.attributes.BaseModuleIdAttribute;
import de.eshg.statistics.api.attributes.BooleanAttribute;
import de.eshg.statistics.api.attributes.DateAttribute;
import de.eshg.statistics.api.attributes.DecimalAttribute;
import de.eshg.statistics.api.attributes.DecimalIntervalAttribute;
import de.eshg.statistics.api.attributes.IntegerAttribute;
import de.eshg.statistics.api.attributes.IntegerIntervalAttribute;
import de.eshg.statistics.api.attributes.ProcedureReferenceAttribute;
import de.eshg.statistics.api.attributes.TextAttribute;
import de.eshg.statistics.api.attributes.ValueOption;
import de.eshg.statistics.api.attributes.ValueWithOptionsAttribute;
import de.eshg.statistics.api.evaluation.EvaluationDataSensitivity;
import de.eshg.statistics.api.evaluation.EvaluationInfo;
import de.eshg.statistics.api.evaluation.EvaluationSortKey;
import de.eshg.statistics.api.evaluation.EvaluationStateDto;
import de.eshg.statistics.api.evaluation.GetAttributesInformationResponse;
import de.eshg.statistics.api.evaluation.GetEvaluationResponse;
import de.eshg.statistics.api.evaluation.GetEvaluationsResponse;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult_;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnDataPrivacyCategory;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public class EvaluationMapper {
  private EvaluationMapper() {}

  public static GetEvaluationResponse mapToApi(
      Evaluation evaluation,
      TableColumn sortTableColumn,
      SortDirection sortDirection,
      List<TableRow> tableRows,
      long totalNumberOfElements,
      boolean isTooMuchDataForExport) {
    return new GetEvaluationResponse(
        mapToEvaluationInfo(evaluation, isTooMuchDataForExport),
        AttributeSelectionMapper.mapToApi(sortTableColumn),
        sortDirection,
        mapToApi(evaluation.getTableColumns()),
        tableRows.stream().map(EvaluationMapper::mapToApi).toList(),
        totalNumberOfElements);
  }

  public static List<TableColumnHeader> mapToApi(List<TableColumn> tableColumns) {
    return tableColumns.stream().map(EvaluationMapper::mapToApi).toList();
  }

  private static TableColumnHeader mapToApi(TableColumn tableColumn) {
    TableColumnDataPrivacyCategory dataPrivacyCategory =
        tableColumn.getAnonymizationConfiguration() == null
            ? null
            : tableColumn.getAnonymizationConfiguration().getDataPrivacyCategory();
    if (tableColumn.getBaseModuleAttributeCode() == null) {
      return new TableColumnHeader(
          getAttributeDisplayName(tableColumn, false),
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getDataSourceName(),
          mapNonBaseModuleIdAttribute(
              tableColumn.getValueType(),
              tableColumn.getBusinessModuleAttributeName(),
              tableColumn.getBusinessModuleAttributeCode(),
              tableColumn.getUnit(),
              tableColumn.getValueToMeanings(),
              tableColumn.getMinMaxNullUnknownValues()),
          mapDataPrivacyCategory(dataPrivacyCategory));
    } else {
      return new TableColumnHeader(
          getAttributeDisplayName(tableColumn, false),
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getDataSourceName(),
          new BaseModuleIdAttribute(
              tableColumn.getBusinessModuleAttributeName(),
              tableColumn.getBusinessModuleAttributeCode(),
              mapNonBaseModuleIdAttribute(
                  tableColumn.getValueType(),
                  tableColumn.getBaseModuleAttributeName(),
                  tableColumn.getBaseModuleAttributeCode(),
                  tableColumn.getUnit(),
                  tableColumn.getValueToMeanings(),
                  tableColumn.getMinMaxNullUnknownValues())),
          mapDataPrivacyCategory(dataPrivacyCategory));
    }
  }

  public static String getAttributeDisplayName(TableColumn tableColumn, boolean withUnit) {
    String name =
        getAttributeDisplayName(
            tableColumn.getBusinessModuleAttributeName(), tableColumn.getBaseModuleAttributeName());
    if (withUnit && tableColumn.getUnit() != null) {
      return "%s in %s".formatted(name, tableColumn.getUnit());
    } else {
      return name;
    }
  }

  public static String getAttributeDisplayName(
      String businessModuleAttributeName, String baseModuleAttributeName) {
    if (baseModuleAttributeName == null) {
      return businessModuleAttributeName;
    } else {
      return "%s: %s".formatted(businessModuleAttributeName, baseModuleAttributeName);
    }
  }

  private static AbstractTableColumnHeaderAttribute mapNonBaseModuleIdAttribute(
      TableColumnValueType valueType,
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
      case DECIMAL_INTERVAL ->
          new DecimalIntervalAttribute(
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
      case INTEGER_INTERVAL ->
          new IntegerIntervalAttribute(
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
      case PROCEDURE_REFERENCE -> new ProcedureReferenceAttribute(attributeName, attributeCode);
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
    return valueToMeanings.stream().map(EvaluationMapper::mapToApi).toList();
  }

  private static ValueOption mapToApi(ValueToMeaning valueToMeaning) {
    return new ValueOption(valueToMeaning.getValue(), valueToMeaning.getMeaning());
  }

  private static DataPrivacyCategory mapDataPrivacyCategory(
      TableColumnDataPrivacyCategory dataPrivacyCategory) {
    return dataPrivacyCategory == null
        ? null
        : DataPrivacyCategory.valueOf(dataPrivacyCategory.name());
  }

  private static DataRow mapToApi(TableRow tableRow) {
    return new DataRow(tableRow.getCellEntries().stream().map(CellEntry::getValue).toList());
  }

  public static List<ValueToMeaning> mapToValueToMeanings(List<ValueOptionInternal> valueOptions) {
    if (valueOptions == null) {
      return Collections.emptyList();
    } else {
      return valueOptions.stream().map(EvaluationMapper::mapToPersistence).toList();
    }
  }

  private static ValueToMeaning mapToPersistence(ValueOptionInternal valueOption) {
    ValueToMeaning valueToMeaning = new ValueToMeaning();
    valueToMeaning.setValue(valueOption.value());
    valueToMeaning.setMeaning(valueOption.meaning());
    valueToMeaning.setUnknownValue(valueOption.isUnknownValue());
    return valueToMeaning;
  }

  public static String mapSortKey(EvaluationSortKey sortKey) {
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

  public static GetEvaluationsResponse mapEvaluationPageToResponse(
      Page<Evaluation> evaluationPage,
      Map<UUID, UserDto> resolvedUsers,
      Predicate<Evaluation> isTooMuchDataForExportPredicate) {
    return new GetEvaluationsResponse(
        evaluationPage.stream()
            .map(
                evaluation ->
                    EvaluationMapper.mapToEvaluationInfo(
                        evaluation, isTooMuchDataForExportPredicate.test(evaluation)))
            .toList(),
        resolvedUsers,
        evaluationPage.getTotalElements());
  }

  public static EvaluationInfo mapToEvaluationInfo(
      Evaluation evaluation, boolean isTooMuchDataForExport) {
    return new EvaluationInfo(
        evaluation.getExternalId(),
        evaluation.getCreatedByUserId(),
        evaluation.getName(),
        getDataSourceNames(evaluation),
        mapToEvaluationState(evaluation.getState()),
        evaluation.getTimeRangeStart(),
        evaluation.getTimeRangeEnd(),
        evaluation.getCreatedAt(),
        mapToApi(evaluation.getDataSensitivity()),
        isTooMuchDataForExport);
  }

  public static List<String> getDataSourceNames(Evaluation evaluation) {
    return evaluation.getTableColumns().stream()
        .map(TableColumn::getDataSourceName)
        .distinct()
        .sorted()
        .toList();
  }

  private static EvaluationStateDto mapToEvaluationState(
      AggregationResultState aggregationResultState) {
    return EvaluationStateDto.valueOf(aggregationResultState.name());
  }

  public static EvaluationDataSensitivity mapToApi(StatisticsDataSensitivity dataSensitivity) {
    return EvaluationDataSensitivity.valueOf(dataSensitivity.name());
  }

  public static List<AggregationResultState> mapToAggregationResultStates(
      List<EvaluationStateDto> evaluationStates) {
    return evaluationStates.stream().map(EvaluationMapper::mapToAggregationResultState).toList();
  }

  private static AggregationResultState mapToAggregationResultState(
      EvaluationStateDto evaluationState) {
    return AggregationResultState.valueOf(evaluationState.name());
  }

  public static GetAttributesInformationResponse getAttributesInformation(
      AbstractAggregationResult aggregationResult) {
    return new GetAttributesInformationResponse(
        aggregationResult.getState(),
        aggregationResult.getTableColumns().stream()
            .map(
                tableColumn ->
                    new AttributesInformation(
                        getAttributeDisplayName(tableColumn, false),
                        tableColumn.getDataSourceName(),
                        mapDataPrivacyCategory(
                            tableColumn.getAnonymizationConfiguration().getDataPrivacyCategory())))
            .toList());
  }
}
