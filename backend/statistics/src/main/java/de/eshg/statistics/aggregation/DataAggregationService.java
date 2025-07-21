/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.StatisticsApplication.MODULE_NAME;

import de.eshg.base.statistics.BaseStatisticsApi;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseDataTableHeader;
import de.eshg.base.statistics.api.GetBaseStatisticsDataRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataResponse;
import de.eshg.base.statistics.api.GetBaseStatisticsDataTableHeaderRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataTableHeaderResponse;
import de.eshg.base.statistics.api.SubjectType;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetDataTableHeaderRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.TClosenessHierarchyEntryDto;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.filter.DecimalValueFilterParameterDto;
import de.eshg.statistics.api.filter.IntegerValueFilterParameterDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.mapper.AnonymizationConfigurationMapper;
import de.eshg.statistics.mapper.AttributeSelectionMapper;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.StatisticsDataSensitivity;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.entity.entry.TextEntry;
import de.eshg.statistics.persistence.entity.entry.UuidEntry;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.repository.CellEntryRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DataAggregationService {
  private static final Logger log = LoggerFactory.getLogger(DataAggregationService.class);

  private static final String ERROR_BUSINESS_MODULE_AGGREGATION =
      "Could not retrieve data from business module";

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final BaseStatisticsApi baseModuleStatisticsApi;
  private final int businessModuleDataRequestPageSize;
  private final TableRowRepository tableRowRepository;
  private final CellEntryRepository cellEntryRepository;
  private final AuditLogger auditLogger;

  public DataAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseStatisticsApi baseModuleStatisticsApi,
      StatisticsConfig statisticsConfig,
      TableRowRepository tableRowRepository,
      CellEntryRepository cellEntryRepository,
      AuditLogger auditLogger) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseModuleStatisticsApi = baseModuleStatisticsApi;
    this.businessModuleDataRequestPageSize = statisticsConfig.businessModule().pageSize();
    this.tableRowRepository = tableRowRepository;
    this.cellEntryRepository = cellEntryRepository;
    this.auditLogger = auditLogger;
  }

  public Evaluation createEvaluation(
      DataSourceDto dataSource,
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      DataSourceSensitivity sensitivity,
      boolean anonymized) {
    GetDataTableHeaderRequest request =
        new GetDataTableHeaderRequest(
            timeRangeStart,
            timeRangeEnd,
            dataSource.id(),
            dataSource.attributeCodes().stream().map(BusinessDataAttribute::code).toList());

    GetDataTableHeaderResponse dataFromBusinessModule =
        getDataTableHeaderFromBusinessModule(request, dataSource.businessModuleName());

    if (!sensitivity.equals(dataFromBusinessModule.sensitivity())) {
      throw new BadRequestException(
          "Different sensitivities from business module, datasource %s - data %s"
              .formatted(sensitivity, dataFromBusinessModule.sensitivity()));
    }

    Map<Integer, Attribute> indexToBaseReferenceAttribute =
        findBaseModuleIdColumns(dataFromBusinessModule.dataTableHeader());

    Map<String, List<String>> codeToBaseAttributeCodes =
        dataSource.attributeCodes().stream()
            .filter(businessDataAttribute -> !businessDataAttribute.baseAttributeCodes().isEmpty())
            .collect(
                Collectors.toMap(
                    BusinessDataAttribute::code, BusinessDataAttribute::baseAttributeCodes));
    Map<Integer, BaseStatisticsData> indexToBaseData =
        retrieveDataFromBase(
            indexToBaseReferenceAttribute,
            codeToBaseAttributeCodes,
            Collections.emptyList(),
            baseRetrievalInformation ->
                retrieveDataTableHeaderFromBase(
                    baseRetrievalInformation.subjectType(),
                    baseRetrievalInformation.attributeCodes()));

    List<TableColumn> tableColumns =
        createTableColumns(
            dataFromBusinessModule.dataSourceName(),
            dataSource.businessModuleName(),
            dataSource.id(),
            dataFromBusinessModule.dataTableHeader().attributes(),
            indexToBaseData,
            indexToBaseReferenceAttribute.keySet());
    if (tableColumns.isEmpty()) {
      throw new BadRequestException("Evaluation has no valid fields");
    }
    StatisticsDataSensitivity originalSensitivity =
        StatisticsDataSensitivity.valueOf(sensitivity.name());
    StatisticsDataSensitivity statisticsDataSensitivity =
        anonymized ? StatisticsDataSensitivity.ANONYMOUS : originalSensitivity;

    Evaluation evaluation = new Evaluation();
    evaluation.setDataSensitivity(statisticsDataSensitivity);
    evaluation.setLastDataSensitivityFromBusinessModule(originalSensitivity);
    evaluation.setName(name);
    evaluation.setTimeRangeStart(timeRangeStart);
    evaluation.setTimeRangeEnd(timeRangeEnd);
    evaluation.addTableColumns(tableColumns);
    evaluation.setNumberOfTableRows(0);
    evaluation.setState(AggregationResultState.CREATING);
    evaluation.setPendingState(AggregationResultPendingState.DATA_AGGREGATION);

    return evaluation;
  }

  private GetDataTableHeaderResponse getDataTableHeaderFromBusinessModule(
      GetDataTableHeaderRequest businessModuleRequest, String businessModuleName) {

    List<ClientResponse<GetDataTableHeaderResponse>> clientResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            Set.of(businessModuleName),
            null,
            client -> client.getDataTableHeader(businessModuleRequest));
    if (clientResponses.isEmpty()) {
      throw new BadRequestException(ERROR_BUSINESS_MODULE_AGGREGATION);
    }

    ClientResponse<GetDataTableHeaderResponse> clientResponse = clientResponses.getFirst();
    GetDataTableHeaderResponse getDataTableHeaderResponse = clientResponse.response();
    if (getDataTableHeaderResponse == null) {
      handleAggregationError(clientResponse);
    }
    return getDataTableHeaderResponse;
  }

  private static void handleAggregationError(ClientResponse<?> clientResponse) {
    ErrorResponseWithLocation errorResponseWithLocation = clientResponse.errorResponse();
    if (errorResponseWithLocation == null) {
      throw new BadRequestException(ERROR_BUSINESS_MODULE_AGGREGATION);
    } else {
      throw new BadRequestException(
          errorResponseWithLocation.errorCode(),
          ERROR_BUSINESS_MODULE_AGGREGATION
              + ": %s".formatted(errorResponseWithLocation.message()));
    }
  }

  private static Map<Integer, Attribute> findBaseModuleIdColumns(DataTableHeader dataTableHeader) {
    return IntStream.range(0, dataTableHeader.attributes().size())
        .filter(
            index ->
                DataSourceAggregationService.isBaseModuleId(
                    dataTableHeader.attributes().get(index).valueType()))
        .boxed()
        .collect(Collectors.toMap(index -> index, dataTableHeader.attributes()::get));
  }

  private BaseStatisticsData retrieveDataTableHeaderFromBase(
      SubjectType subjectType, List<String> attributeCodes) {
    GetBaseStatisticsDataTableHeaderRequest baseStatisticsDataTableRequest =
        new GetBaseStatisticsDataTableHeaderRequest(subjectType.name(), attributeCodes);

    GetBaseStatisticsDataTableHeaderResponse dataTableHeaderResponse =
        baseModuleStatisticsApi.getDataTableHeader(baseStatisticsDataTableRequest);

    return new BaseStatisticsData(
        dataTableHeaderResponse.dataTableHeader(), Collections.emptyList());
  }

  private Map<Integer, BaseStatisticsData> retrieveDataFromBase(
      Map<Integer, Attribute> indexToBaseReferenceAttribute,
      Map<String, List<String>> codeToBaseAttributeCodes,
      List<DataRow> dataRows,
      Function<BaseRetrievalInformation, BaseStatisticsData> baseRetrievalFunction) {
    Map<Integer, BaseStatisticsData> indexToDataFromBase = new HashMap<>();

    indexToBaseReferenceAttribute.forEach(
        (key, value) -> {
          List<String> baseAttributeCodes = codeToBaseAttributeCodes.get(value.code());
          if (DataSourceAggregationService.isBaseModuleId(value.valueType())) {
            if (baseAttributeCodes == null || baseAttributeCodes.isEmpty()) {
              indexToDataFromBase.put(
                  key,
                  new BaseStatisticsData(new BaseDataTableHeader(Collections.emptyList()), null));
            } else {
              List<UUID> baseModuleIds =
                  dataRows.stream()
                      .map(dataRow -> mapToUuid(dataRow.values().get(key)))
                      .filter(Objects::nonNull)
                      .toList();
              SubjectType subjectType =
                  DataSourceAggregationService.mapToSubjectType(value.valueType());
              indexToDataFromBase.put(
                  key,
                  baseRetrievalFunction.apply(
                      new BaseRetrievalInformation(
                          subjectType, baseAttributeCodes, baseModuleIds)));
            }
          }
        });

    return indexToDataFromBase;
  }

  private static UUID mapToUuid(Object object) {
    if (object instanceof UUID uuid) {
      return uuid;
    }
    if (object instanceof String uuidString) {
      try {
        return UUID.fromString(uuidString);
      } catch (IllegalArgumentException e) {
        return null;
      }
    }
    return null;
  }

  private static List<TableColumn> createTableColumns(
      String dataSourceName,
      String businessModuleName,
      UUID dataSourceId,
      List<Attribute> businessModuleAttributes,
      Map<Integer, BaseStatisticsData> indexToBaseData,
      Set<Integer> baseReferenceIndexes) {
    List<TableColumn> tableColumns = new ArrayList<>();

    IntStream.range(0, businessModuleAttributes.size())
        .forEach(
            index -> {
              Attribute attribute = businessModuleAttributes.get(index);
              if (baseReferenceIndexes.contains(index)) {
                BaseStatisticsData statisticsDataFromBase = indexToBaseData.get(index);
                if (statisticsDataFromBase != null) {
                  List<BaseAttribute> baseAttributes =
                      statisticsDataFromBase.dataTableHeader().attributes();
                  List<TableColumn> columns =
                      createTableColumnsForBaseAttributes(
                          dataSourceName,
                          businessModuleName,
                          dataSourceId,
                          attribute,
                          baseAttributes);
                  tableColumns.addAll(columns);
                }
              } else {
                tableColumns.add(
                    createTableColumn(
                        dataSourceName, businessModuleName, dataSourceId, attribute, null));
              }
            });
    return tableColumns;
  }

  private static TableColumn createTableColumn(
      String dataSourceName,
      String businessModuleName,
      UUID dataSourceId,
      Attribute businessModuleAttribute,
      BaseAttribute baseModuleAttribute) {
    TableColumn tableColumn = new TableColumn();
    tableColumn.setBusinessModuleName(businessModuleName);
    tableColumn.setBusinessModuleAttributeCode(businessModuleAttribute.code());
    tableColumn.setBusinessModuleAttributeName(businessModuleAttribute.name());
    tableColumn.setDataSourceName(dataSourceName);
    tableColumn.setDataSourceId(dataSourceId);

    DataPrivacyCategory dataPrivacyCategory;
    Integer lDiversity;
    Double tCloseness;
    List<TClosenessHierarchyEntryDto> tClosenessHierarchyEntries;
    IntervalConfiguration intervalConfiguration;
    if (baseModuleAttribute == null) {
      tableColumn.setValueType(mapToTableColumnValueType(businessModuleAttribute.valueType()));
      tableColumn.setUnit(businessModuleAttribute.unit());
      tableColumn.addValueToMeanings(
          EvaluationMapper.mapToValueToMeanings(businessModuleAttribute.valueOptions()));
      tableColumn.setMandatory(businessModuleAttribute.mandatory());

      dataPrivacyCategory = businessModuleAttribute.dataPrivacyCategory();
      lDiversity = businessModuleAttribute.lDiversity();
      tCloseness = businessModuleAttribute.tCloseness();
      tClosenessHierarchyEntries = businessModuleAttribute.tClosenessHierarchyEntries();
      intervalConfiguration = businessModuleAttribute.intervalConfiguration();
    } else {
      tableColumn.setBaseModuleAttributeCode(baseModuleAttribute.code());
      tableColumn.setBaseModuleAttributeName(baseModuleAttribute.name());
      tableColumn.setValueType(mapToTableColumnValueType(baseModuleAttribute.valueType()));
      tableColumn.setUnit(baseModuleAttribute.unit());
      tableColumn.addValueToMeanings(
          EvaluationMapper.mapToValueToMeanings(baseModuleAttribute.valueOptions()));
      tableColumn.setMandatory(baseModuleAttribute.mandatory());

      dataPrivacyCategory = baseModuleAttribute.dataPrivacyCategory();
      lDiversity = null;
      tCloseness = null;
      tClosenessHierarchyEntries = null;
      intervalConfiguration = baseModuleAttribute.intervalConfiguration();
    }

    tableColumn.setAnonymizationConfiguration(
        AnonymizationConfigurationMapper.mapToPersistence(
            dataPrivacyCategory,
            lDiversity,
            tCloseness,
            tClosenessHierarchyEntries,
            intervalConfiguration));

    tableColumn.setSearchKey(
        AttributeSelectionMapper.buildSearchKey(
            tableColumn.getBusinessModuleAttributeCode(),
            tableColumn.getDataSourceId(),
            tableColumn.getBusinessModuleName(),
            tableColumn.getBaseModuleAttributeCode()));

    return tableColumn;
  }

  private static TableColumnValueType mapToTableColumnValueType(ValueType valueType) {
    return TableColumnValueType.valueOf(valueType.name());
  }

  private static List<TableColumn> createTableColumnsForBaseAttributes(
      String dataSourceName,
      String businessModuleName,
      UUID dataSourceId,
      Attribute businessAttribute,
      List<BaseAttribute> baseAttributes) {
    List<BaseAttribute> responseBaseAttributes =
        baseAttributes.stream()
            .filter(
                baseAttribute ->
                    !DataSourceAggregationService.isBaseModuleId(baseAttribute.valueType()))
            .toList();
    if (responseBaseAttributes.isEmpty()) {
      return Collections.emptyList();
    } else {
      return responseBaseAttributes.stream()
          .map(
              baseAttribute ->
                  createTableColumn(
                      dataSourceName,
                      businessModuleName,
                      dataSourceId,
                      businessAttribute,
                      baseAttribute))
          .toList();
    }
  }

  public void collectTableRows(AbstractAggregationResult aggregationResult) {
    Long tableRowsCount = tableRowRepository.countTableRowByAggregationResult(aggregationResult);
    int page = (int) (tableRowsCount / businessModuleDataRequestPageSize);
    int ignoreTableRowsCount = (int) (tableRowsCount % businessModuleDataRequestPageSize);

    TableColumn firstTableColumn = aggregationResult.getTableColumns().getFirst();
    List<String> attributeCodes = getBusinessModuleAttributeCodes(aggregationResult);
    GetSpecificDataRequest request =
        new GetSpecificDataRequest(
            aggregationResult.getTimeRangeStart(),
            aggregationResult.getTimeRangeEnd(),
            firstTableColumn.getDataSourceId(),
            attributeCodes,
            page,
            businessModuleDataRequestPageSize);

    GetSpecificDataResponse dataFromBusinessModule =
        getDataFromBusinessModule(request, firstTableColumn.getBusinessModuleName());

    validateAndUpdateSensitivity(dataFromBusinessModule, aggregationResult);
    aggregationResult.setKAnonymity(dataFromBusinessModule.kAnonymity());

    Map<Integer, Attribute> indexToBaseReferenceAttribute =
        findBaseModuleIdColumns(dataFromBusinessModule.dataTableHeader());

    Map<String, List<String>> codeToBaseAttributeCodes =
        getCodeToBaseAttributeCodesMap(aggregationResult.getTableColumns());
    Map<Integer, BaseStatisticsData> indexToBaseData =
        retrieveDataFromBase(
            indexToBaseReferenceAttribute,
            codeToBaseAttributeCodes,
            dataFromBusinessModule.dataRows(),
            baseRetrievalInformation ->
                retrieveSpecificDataFromBase(
                    baseRetrievalInformation.subjectType(),
                    baseRetrievalInformation.attributeCodes(),
                    baseRetrievalInformation.baseModuleIds()));

    validateAndUpdateTableColumns(
        aggregationResult,
        createTableColumns(
            dataFromBusinessModule.dataSourceName(),
            firstTableColumn.getBusinessModuleName(),
            firstTableColumn.getDataSourceId(),
            dataFromBusinessModule.dataTableHeader().attributes(),
            indexToBaseData,
            indexToBaseReferenceAttribute.keySet()));

    List<DataRow> relevantDataRows;
    if (ignoreTableRowsCount == 0) {
      relevantDataRows = dataFromBusinessModule.dataRows();
    } else if (ignoreTableRowsCount < dataFromBusinessModule.dataRows().size()) {
      relevantDataRows =
          dataFromBusinessModule
              .dataRows()
              .subList(ignoreTableRowsCount, dataFromBusinessModule.dataRows().size());
    } else {
      relevantDataRows = Collections.emptyList();
    }

    MergeInformation mergeInformation =
        createMergeInformation(
            dataFromBusinessModule.dataTableHeader(),
            indexToBaseReferenceAttribute,
            indexToBaseData);
    Map<Integer, Map<UUID, DataRow>> indexToBaseModuleIdRows =
        createIndexToBaseModuleIdRows(indexToBaseData);

    for (DataRow dataRow : relevantDataRows) {
      aggregationResult.addTableRow(
          createMergedTableRow(
              dataRow,
              indexToBaseModuleIdRows,
              mergeInformation,
              aggregationResult.getTableColumns()));
    }

    aggregationResult.setNumberOfTableRows(tableRowsCount + relevantDataRows.size());

    boolean dataComplete =
        relevantDataRows.isEmpty()
            || aggregationResult.getNumberOfTableRows()
                >= dataFromBusinessModule.totalNumberOfElements();
    if (dataComplete) {
      aggregationResult.setPendingState(AggregationResultPendingState.MIN_MAX_DETERMINATION);
      auditLogAggregationResult(aggregationResult);
    }
  }

  private GetSpecificDataResponse getDataFromBusinessModule(
      GetSpecificDataRequest businessModuleRequest, String businessModuleName) {
    List<ClientResponse<GetSpecificDataResponse>> clientResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            Set.of(businessModuleName),
            null,
            client -> client.getSpecificData(businessModuleRequest));
    if (clientResponses.isEmpty()) {
      throw new BadRequestException(ERROR_BUSINESS_MODULE_AGGREGATION);
    }

    ClientResponse<GetSpecificDataResponse> clientResponse = clientResponses.getFirst();
    GetSpecificDataResponse getSpecificDataResponse = clientResponse.response();
    if (getSpecificDataResponse == null) {
      handleAggregationError(clientResponse);
    }
    return getSpecificDataResponse;
  }

  private static void validateAndUpdateSensitivity(
      GetSpecificDataResponse dataFromBusinessModule, AbstractAggregationResult aggregationResult) {
    StatisticsDataSensitivity sensitivityFromModule =
        StatisticsDataSensitivity.valueOf(dataFromBusinessModule.sensitivity().name());

    aggregationResult.setLastDataSensitivityFromBusinessModule(sensitivityFromModule);
    if (!aggregationResult.getDataSensitivity().equals(StatisticsDataSensitivity.ANONYMOUS)
        && !aggregationResult.getDataSensitivity().equals(sensitivityFromModule)) {
      throw new BadRequestException(
          "Sensitivity changed to %s".formatted(dataFromBusinessModule.sensitivity()));
    }
  }

  private BaseStatisticsData retrieveSpecificDataFromBase(
      SubjectType subjectType, List<String> attributeCodes, List<UUID> baseModuleIds) {
    GetBaseStatisticsDataRequest baseStatisticsDataRequest =
        new GetBaseStatisticsDataRequest(subjectType.name(), attributeCodes, baseModuleIds);

    GetBaseStatisticsDataResponse specificData =
        baseModuleStatisticsApi.getSpecificData(baseStatisticsDataRequest);

    return new BaseStatisticsData(specificData.dataTableHeader(), specificData.dataRows());
  }

  private static List<String> getBusinessModuleAttributeCodes(
      AbstractAggregationResult aggregationResult) {
    Set<String> codesAdded = new HashSet<>();
    return aggregationResult.getTableColumns().stream()
        .map(TableColumn::getBusinessModuleAttributeCode)
        .filter(codesAdded::add)
        .toList();
  }

  private static Map<String, List<String>> getCodeToBaseAttributeCodesMap(
      List<TableColumn> tableColumns) {
    Map<String, List<String>> codeToBaseAttributeCodes = new HashMap<>();
    tableColumns.forEach(
        tableColumn -> {
          if (tableColumn.getBaseModuleAttributeCode() != null) {
            String code = tableColumn.getBusinessModuleAttributeCode();
            codeToBaseAttributeCodes.computeIfAbsent(code, k -> new ArrayList<>());
            codeToBaseAttributeCodes.get(code).add(tableColumn.getBaseModuleAttributeCode());
          }
        });
    return codeToBaseAttributeCodes;
  }

  private static void validateAndUpdateTableColumns(
      AbstractAggregationResult aggregationResult, List<TableColumn> newTableColumns) {
    String errorMessage =
        "Different data structure from business module during aggregation %s"
            .formatted(aggregationResult.getExternalId());
    if (aggregationResult.getTableColumns().size() != newTableColumns.size()) {
      throw new BadRequestException(errorMessage);
    }

    IntStream.range(0, aggregationResult.getTableColumns().size())
        .forEach(
            index -> {
              TableColumn currentTableColumn = aggregationResult.getTableColumns().get(index);
              TableColumn newTableColumn = newTableColumns.get(index);

              updateValueToMeaningIfAllowed(
                  currentTableColumn, newTableColumn.getValueToMeanings());

              updateAnonymizationConfiguration(
                  currentTableColumn, newTableColumn.getAnonymizationConfiguration());
            });

    if (IntStream.range(0, aggregationResult.getTableColumns().size())
        .anyMatch(
            index -> {
              TableColumn firstTableColumn = aggregationResult.getTableColumns().get(index);
              TableColumn secondTableColumn = newTableColumns.get(index);

              return isDifferentTableColumn(firstTableColumn, secondTableColumn);
            })) {
      throw new BadRequestException(errorMessage);
    }
  }

  private static void updateValueToMeaningIfAllowed(
      TableColumn currentTableColumn, List<ValueToMeaning> valueToMeanings) {
    if (currentTableColumn.getValueToMeanings().size() < valueToMeanings.size()) {
      Map<String, String> valueToMeaningMap =
          valueToMeanings.stream()
              .collect(Collectors.toMap(ValueToMeaning::getValue, ValueToMeaning::getMeaning));

      if (currentTableColumn.getValueToMeanings().stream()
          .allMatch(
              valueToMeaning ->
                  valueToMeaningMap.get(valueToMeaning.getValue()) != null
                      && valueToMeaningMap
                          .get(valueToMeaning.getValue())
                          .equals(valueToMeaning.getMeaning()))) {
        currentTableColumn.setValueToMeanings(valueToMeanings);
      }
    }
  }

  private static void updateAnonymizationConfiguration(
      TableColumn currentTableColumn, AnonymizationConfiguration newConfiguration) {
    if (newConfiguration == null) {
      currentTableColumn.setAnonymizationConfiguration(null);
    } else {
      AnonymizationConfiguration currentConfiguration;
      if (currentTableColumn.getAnonymizationConfiguration() == null) {
        currentConfiguration = new AnonymizationConfiguration();
        currentTableColumn.setAnonymizationConfiguration(currentConfiguration);
      } else {
        currentConfiguration = currentTableColumn.getAnonymizationConfiguration();
      }

      EvaluationCopyService.copyAnonymizationConfiguration(currentConfiguration, newConfiguration);
    }
  }

  private static boolean isDifferentTableColumn(
      TableColumn firstTableColumn, TableColumn secondTableColumn) {
    if (!firstTableColumn.getBusinessModuleName().equals(secondTableColumn.getBusinessModuleName())
        || !firstTableColumn.getDataSourceId().equals(secondTableColumn.getDataSourceId())
        || !firstTableColumn
            .getBusinessModuleAttributeCode()
            .equals(secondTableColumn.getBusinessModuleAttributeCode())
        || !firstTableColumn.getValueType().equals(secondTableColumn.getValueType())
        || !Objects.equals(
            firstTableColumn.getBaseModuleAttributeCode(),
            secondTableColumn.getBaseModuleAttributeCode())
        || !Objects.equals(firstTableColumn.getUnit(), secondTableColumn.getUnit())
        || firstTableColumn.isMandatory() != secondTableColumn.isMandatory()) {
      return true;
    }
    if (firstTableColumn.getValueToMeanings().size()
        != secondTableColumn.getValueToMeanings().size()) {
      return true;
    } else {
      Map<String, String> valueToMeaningMap =
          firstTableColumn.getValueToMeanings().stream()
              .collect(Collectors.toMap(ValueToMeaning::getValue, ValueToMeaning::getMeaning));
      return secondTableColumn.getValueToMeanings().stream()
          .anyMatch(
              otherValueToMeaning ->
                  valueToMeaningMap.get(otherValueToMeaning.getValue()) == null
                      || !valueToMeaningMap
                          .get(otherValueToMeaning.getValue())
                          .equals(otherValueToMeaning.getMeaning()));
    }
  }

  private static MergeInformation createMergeInformation(
      DataTableHeader dataTableHeader,
      Map<Integer, Attribute> indexToBaseReferenceAttribute,
      Map<Integer, BaseStatisticsData> indexToBaseData) {
    MergeInformation mergeInformation =
        new MergeInformation(indexToBaseReferenceAttribute.keySet(), new HashMap<>());

    List<Attribute> businessModuleAttributes = dataTableHeader.attributes();

    IntStream.range(0, businessModuleAttributes.size())
        .forEach(
            index -> {
              if (mergeInformation.baseReferenceIndexes().contains(index)) {
                BaseStatisticsData statisticsDataFromBase = indexToBaseData.get(index);
                if (statisticsDataFromBase == null) {
                  mergeInformation.indexToNumberOfBaseColumns().put(index, 0);
                } else {
                  List<BaseAttribute> baseAttributes =
                      statisticsDataFromBase.dataTableHeader().attributes();
                  int baseAttributeSize =
                      baseAttributes.stream()
                          .filter(
                              baseAttribute ->
                                  !DataSourceAggregationService.isBaseModuleId(
                                      baseAttribute.valueType()))
                          .toList()
                          .size();
                  mergeInformation.indexToNumberOfBaseColumns().put(index, baseAttributeSize);
                }
              }
            });

    return mergeInformation;
  }

  private static Map<Integer, Map<UUID, DataRow>> createIndexToBaseModuleIdRows(
      Map<Integer, BaseStatisticsData> indexToBaseData) {
    return indexToBaseData.entrySet().stream()
        .collect(
            Collectors.toMap(
                Map.Entry::getKey,
                entry ->
                    createBaseModuleIdMap(
                        entry.getValue().dataTableHeader().attributes(),
                        entry.getValue().dataRows())));
  }

  private static Map<UUID, DataRow> createBaseModuleIdMap(
      List<BaseAttribute> attributes, List<DataRow> dataRows) {
    if (dataRows == null) {
      return new HashMap<>();
    }

    int indexBaseModuleId = getIndexBaseModuleId(attributes);
    Map<UUID, DataRow> baseModuleIdToRow = new HashMap<>();
    dataRows.forEach(
        row -> {
          List<Object> objects = new ArrayList<>(row.values());
          UUID uuid = mapToUuid(objects.remove(indexBaseModuleId));
          baseModuleIdToRow.put(uuid, new DataRow(objects));
        });

    return baseModuleIdToRow;
  }

  private static int getIndexBaseModuleId(List<BaseAttribute> attributes) {
    return IntStream.range(0, attributes.size())
        .filter(
            index -> DataSourceAggregationService.isBaseModuleId(attributes.get(index).valueType()))
        .findFirst()
        .orElse(-1);
  }

  private TableRow createMergedTableRow(
      DataRow dataRow,
      Map<Integer, Map<UUID, DataRow>> indexToBaseModuleIdRows,
      MergeInformation mergeInformation,
      List<TableColumn> tableColumns) {
    List<Object> values = new ArrayList<>();
    IntStream.range(0, dataRow.values().size())
        .forEach(
            index -> {
              Object value = dataRow.values().get(index);
              if (mergeInformation.baseReferenceIndexes().contains(index)) {
                Map<UUID, DataRow> uuidDataRowMap = indexToBaseModuleIdRows.get(index);
                UUID uuid = mapToUuid(value);
                if (uuid == null || uuidDataRowMap.get(uuid) == null) {
                  addNullValues(values, mergeInformation.indexToNumberOfBaseColumns.get(index));
                } else {
                  values.addAll(uuidDataRowMap.get(uuid).values());
                }
              } else {
                values.add(value);
              }
            });

    List<CellEntry> cellEntries = new ArrayList<>();
    IntStream.range(0, tableColumns.size())
        .forEach(
            index -> {
              Object value = values.size() > index ? values.get(index) : null;
              cellEntries.add(createCellEntry(value, tableColumns.get(index)));
            });

    TableRow tableRow = new TableRow();
    tableRow.addCellEntries(cellEntries);
    return tableRow;
  }

  private static void addNullValues(List<Object> allValues, int columnCountBaseModule) {
    IntStream.range(0, columnCountBaseModule).forEach(index -> allValues.add(null));
  }

  private CellEntry createCellEntry(Object value, TableColumn tableColumn) {
    CellEntry cellEntry =
        switch (tableColumn.getValueType()) {
          case BOOLEAN -> createBooleanEntry(value);
          case DATE -> createDateAsTextEntry(value);
          case DECIMAL -> createDecimalEntry(value);
          case INTEGER -> createIntegerEntry(value);
          case TEXT, VALUE_WITH_OPTIONS -> createTextEntry(value);
          case PROCEDURE_REFERENCE -> createUuidEntry(value);
          case DECIMAL_INTERVAL, INTEGER_INTERVAL ->
              throw new IllegalStateException("Intervals not allowed in aggregation");
        };

    tableColumn.addCellEntry(cellEntry);
    return cellEntry;
  }

  private static BooleanEntry createBooleanEntry(Object value) {
    BooleanEntry entry = new BooleanEntry();
    if (value instanceof Boolean boolValue) {
      entry.setBoolValue(boolValue);
    }
    return entry;
  }

  private TextEntry createDateAsTextEntry(Object value) {
    TextEntry entry = new TextEntry();
    if (value instanceof String stringValue) {
      try {
        entry.setTextValue(LocalDate.parse(stringValue).toString());
      } catch (DateTimeParseException ignored) {
        log.debug("Could not interpret value {} as date, value is ignored", stringValue);
      }
    }
    return entry;
  }

  private DecimalEntry createDecimalEntry(Object value) {
    BigDecimal bigDecimalValue = null;
    if (value instanceof Double doubleValue) {
      bigDecimalValue =
          BigDecimal.valueOf(doubleValue).setScale(4, RoundingMode.HALF_UP).stripTrailingZeros();
    }
    if (value instanceof Integer integerValue) {
      bigDecimalValue = BigDecimal.valueOf(integerValue);
    }
    if (value instanceof Long longValue) {
      bigDecimalValue = BigDecimal.valueOf(longValue);
    }

    // Avoid SQL error
    // "A field with precision 10, scale 4 must round to an absolute value less than 10^6"
    BigDecimal maxValue = new BigDecimal("999999.9999");
    BigDecimal minValue = new BigDecimal("-999999.9999");
    if (bigDecimalValue != null
        && (bigDecimalValue.compareTo(minValue) < 0 || bigDecimalValue.compareTo(maxValue) > 0)) {
      log.debug("Value {} exceeds the allowed absolute of 10^6, value is ignored", bigDecimalValue);
      bigDecimalValue = null;
    }

    DecimalEntry entry = new DecimalEntry();
    entry.setBigDecimalValue(bigDecimalValue);
    return entry;
  }

  private static IntegerEntry createIntegerEntry(Object value) {
    IntegerEntry entry = new IntegerEntry();
    if (value instanceof Integer integerValue) {
      entry.setIntegerValue(integerValue);
    }
    return entry;
  }

  private static TextEntry createTextEntry(Object value) {
    TextEntry entry = new TextEntry();
    if (value instanceof String stringValue && !stringValue.isBlank()) {
      entry.setTextValue(stringValue);
    }
    return entry;
  }

  private static UuidEntry createUuidEntry(Object value) {
    UuidEntry entry = new UuidEntry();
    entry.setUuidValue(mapToUuid(value));
    return entry;
  }

  public void determineMinMaxNullUnknownValues(AbstractAggregationResult aggregationResult) {
    aggregationResult.getTableColumns().stream()
        .filter(
            tableColumn ->
                !tableColumn.getValueType().equals(TableColumnValueType.PROCEDURE_REFERENCE))
        .forEach(
            tableColumn ->
                tableColumn.setMinMaxNullUnknownValues(
                    determineMinMaxNullUnknownValues(tableColumn, true)));
  }

  public void redetermineNullUnknownValues(Stream<TableColumn> tableColumnStream) {
    tableColumnStream.forEach(tableColumn -> determineMinMaxNullUnknownValues(tableColumn, false));
  }

  private MinMaxNullUnknownValues determineMinMaxNullUnknownValues(
      TableColumn tableColumn, boolean withMinMaxDecimalAndInteger) {
    return switch (tableColumn.getValueType()) {
      case BOOLEAN -> determineNullValuesBoolean(tableColumn);
      case DATE -> determineNullUnknownValuesDate(tableColumn);
      case DECIMAL ->
          determineMinMaxNullUnknownValuesDecimal(tableColumn, withMinMaxDecimalAndInteger);
      case INTEGER ->
          determineMinMaxNullUnknownValuesInteger(tableColumn, withMinMaxDecimalAndInteger);
      case TEXT, VALUE_WITH_OPTIONS -> determineNullUnknownValuesText(tableColumn);
      case PROCEDURE_REFERENCE ->
          throw new IllegalArgumentException("No min/max/unknown/null for procedure references");
      case DECIMAL_INTERVAL -> {
        if (withMinMaxDecimalAndInteger) {
          throw new IllegalArgumentException("Intervals not allowed for min/max determination");
        } else {
          yield determineMinMaxNullUnknownValuesDecimal(tableColumn, false);
        }
      }
      case INTEGER_INTERVAL -> {
        if (withMinMaxDecimalAndInteger) {
          throw new IllegalArgumentException("Intervals not allowed for min/max determination");
        } else {
          yield determineMinMaxNullUnknownValuesInteger(tableColumn, false);
        }
      }
    };
  }

  private MinMaxNullUnknownValues determineNullValuesBoolean(TableColumn tableColumn) {
    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(TableRowSpecifications.getNullSpecification(tableColumn)));
    return minMaxNullUnknownValues;
  }

  private MinMaxNullUnknownValues getOrCreateMinMax(TableColumn tableColumn) {
    return tableColumn.getMinMaxNullUnknownValues() == null
        ? new MinMaxNullUnknownValues()
        : tableColumn.getMinMaxNullUnknownValues();
  }

  private MinMaxNullUnknownValues determineNullUnknownValuesDate(TableColumn tableColumn) {
    LocalDate unknownValue =
        getUnknownValueOptional(tableColumn)
            .map(DataAggregationService::getUnknownDate)
            .orElse(null);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(TableRowSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                TableRowSpecifications.getEqualDateSpecification(tableColumn, unknownValue)));
    minMaxNullUnknownValues.setUnknownValue(unknownValue == null ? null : unknownValue.toString());

    return minMaxNullUnknownValues;
  }

  private static LocalDate getUnknownDate(ValueToMeaning valueToMeaning) {
    try {
      return LocalDate.parse(valueToMeaning.getValue());
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  @SuppressWarnings("java:S2637")
  private MinMaxNullUnknownValues determineMinMaxNullUnknownValuesDecimal(
      TableColumn tableColumn, boolean withMinMax) {
    BigDecimal unknownValue = getUnknownNumberValue(tableColumn, BigDecimal::new);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(TableRowSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                TableRowSpecifications.getDecimalValueFilterSpecification(
                    tableColumn,
                    new DecimalValueFilterParameterDto(
                        null, unknownValue, NumericComparisonDto.EQUAL, false))));
    minMaxNullUnknownValues.setUnknownValue(unknownValue == null ? null : unknownValue.toString());

    if (withMinMax) {
      minMaxNullUnknownValues.setMinDecimal(
          cellEntryRepository.findDecimalValueMin(tableColumn, unknownValue));
      minMaxNullUnknownValues.setMaxDecimal(
          cellEntryRepository.findDecimalValueMax(tableColumn, unknownValue));
    }

    return minMaxNullUnknownValues;
  }

  @SuppressWarnings("java:S2637")
  private MinMaxNullUnknownValues determineMinMaxNullUnknownValuesInteger(
      TableColumn tableColumn, boolean withMinMax) {
    Integer unknownValue = getUnknownNumberValue(tableColumn, Integer::parseInt);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(TableRowSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                TableRowSpecifications.getIntegerValueFilterSpecification(
                    tableColumn,
                    new IntegerValueFilterParameterDto(
                        null, unknownValue, NumericComparisonDto.EQUAL, false))));
    minMaxNullUnknownValues.setUnknownValue(unknownValue == null ? null : unknownValue.toString());

    if (withMinMax) {
      minMaxNullUnknownValues.setMinInteger(
          cellEntryRepository.findIntegerValueMin(tableColumn, unknownValue));
      minMaxNullUnknownValues.setMaxInteger(
          cellEntryRepository.findIntegerValueMax(tableColumn, unknownValue));
    }

    return minMaxNullUnknownValues;
  }

  private MinMaxNullUnknownValues determineNullUnknownValuesText(TableColumn tableColumn) {
    String unknownValue =
        getUnknownValueOptional(tableColumn).map(ValueToMeaning::getValue).orElse(null);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(TableRowSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                TableRowSpecifications.getTextFilterSpecificationExactly(
                    tableColumn, unknownValue)));
    minMaxNullUnknownValues.setUnknownValue(unknownValue);

    return minMaxNullUnknownValues;
  }

  private static <T> T getUnknownNumberValue(
      TableColumn tableColumn, Function<String, T> parseFunction) {
    return getUnknownValueOptional(tableColumn)
        .map(ValueToMeaning::getValue)
        .map(
            value -> {
              try {
                return parseFunction.apply(value);
              } catch (NumberFormatException ignored) {
                return null;
              }
            })
        .orElse(null);
  }

  private static Optional<ValueToMeaning> getUnknownValueOptional(TableColumn tableColumn) {
    return tableColumn.getValueToMeanings().stream()
        .filter(ValueToMeaning::isUnknownValue)
        .findFirst();
  }

  private void auditLogAggregationResult(AbstractAggregationResult aggregationResult) {
    Map<String, String> logData = new HashMap<>();
    String function =
        switch (aggregationResult) {
          case Evaluation evaluation -> {
            logData.put("User-ID", evaluation.getCreatedByUserId().toString());
            yield "Erstellen einer Auswertung";
          }
          case Report report -> {
            logData.put("User-ID", report.getReportSeries().getCreatedByUserId().toString());
            yield switch (report.getReportSeries().getReportType()) {
              case AUTO -> {
                logData.put("Reportserien-ID", report.getReportSeries().getExternalId().toString());
                yield "Erstellen einer automatischen Reportausgabe";
              }
              case MANUAL -> "Erstellen eines manuellen Einzelreports";
            };
          }
          default -> throw new IllegalStateException("Unexpected value: " + aggregationResult);
        };
    addTableColumnsLogData(logData, aggregationResult);
    logData.put("Anzahl Datensätze", String.valueOf(aggregationResult.getNumberOfTableRows()));
    auditLogger.log(MODULE_NAME, function, logData);
  }

  public static void addTableColumnsLogData(
      Map<String, String> auditLogData, AbstractAggregationResult aggregationResult) {
    auditLogData.put(
        "Datenquellen",
        aggregationResult.getTableColumns().stream()
            .map(TableColumn::getDataSourceName)
            .distinct()
            .collect(Collectors.joining(", ")));
    auditLogData.put(
        "Aggregierte Attribute",
        aggregationResult.getTableColumns().stream()
            .map(
                tableColumn -> {
                  StringBuilder sb =
                      new StringBuilder(tableColumn.getBusinessModuleAttributeName());
                  if (tableColumn.getBaseModuleAttributeName() != null) {
                    sb.append(":");
                    sb.append(tableColumn.getBaseModuleAttributeName());
                  }
                  return sb.toString();
                })
            .collect(Collectors.joining(", ")));
  }

  private record BaseRetrievalInformation(
      SubjectType subjectType, List<String> attributeCodes, List<UUID> baseModuleIds) {}

  private record BaseStatisticsData(BaseDataTableHeader dataTableHeader, List<DataRow> dataRows) {}

  private record MergeInformation(
      Set<Integer> baseReferenceIndexes, Map<Integer, Integer> indexToNumberOfBaseColumns) {}
}
