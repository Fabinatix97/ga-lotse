/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.StatisticsApplication.MODULE_NAME;

import de.eshg.base.statistics.BaseStatisticsApi;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseDataTableHeader;
import de.eshg.base.statistics.api.GetBaseStatisticsDataRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataResponse;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.SubjectType;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.statistics.api.BusinessDataAttribute;
import de.eshg.statistics.api.DataSourceDto;
import de.eshg.statistics.api.filter.NumericComparisonDto;
import de.eshg.statistics.mapper.AttributeSelectionMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DateEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.entity.entry.TextEntry;
import de.eshg.statistics.persistence.entity.entry.UuidEntry;
import de.eshg.statistics.persistence.entity.report.Report;
import de.eshg.statistics.persistence.repository.CellEntryRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DataAggregationService {
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final BaseStatisticsApi baseModuleStatisticsApi;
  private final int pageSizeForBusinessModuleDataRequest;
  private final TableRowRepository tableRowRepository;
  private final CellEntryRepository cellEntryRepository;
  private final AuditLogger auditLogger;

  public DataAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseStatisticsApi baseModuleStatisticsApi,
      @Value("${eshg.statistics.businessmodule.pagesize:500}")
          int pageSizeForBusinessModuleDataRequest,
      TableRowRepository tableRowRepository,
      CellEntryRepository cellEntryRepository,
      AuditLogger auditLogger) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseModuleStatisticsApi = baseModuleStatisticsApi;
    this.pageSizeForBusinessModuleDataRequest = pageSizeForBusinessModuleDataRequest;
    this.tableRowRepository = tableRowRepository;
    this.cellEntryRepository = cellEntryRepository;
    this.auditLogger = auditLogger;
    if (this.pageSizeForBusinessModuleDataRequest <= 0) {
      throw new IllegalArgumentException(
          "'eshg.statistics.businessmodule.pagesize' must be greater than 0");
    }
  }

  public Statistic createStatistic(
      DataSourceDto dataSource, String name, Instant timeRangeStart, Instant timeRangeEnd) {
    GetSpecificDataRequest request =
        new GetSpecificDataRequest(
            timeRangeStart,
            timeRangeEnd,
            dataSource.id(),
            dataSource.attributeCodes().stream().map(BusinessDataAttribute::code).toList(),
            0,
            1);

    GetSpecificDataResponse dataFromBusinessModule =
        getDataFromBusinessModule(request, dataSource.businessModuleName());

    Map<Integer, Attribute> indexToBaseReferenceAttribute =
        findCentralFileColumns(dataFromBusinessModule.dataTableHeader());

    Map<String, List<String>> codeToBaseAttributeCodes =
        dataSource.attributeCodes().stream()
            .filter(businessDataAttribute -> !businessDataAttribute.baseAttributeCodes().isEmpty())
            .collect(
                Collectors.toMap(
                    BusinessDataAttribute::code, BusinessDataAttribute::baseAttributeCodes));
    Map<Integer, BaseStatisticsData> indexToBaseData =
        retrieveDataFromBase(
            indexToBaseReferenceAttribute, codeToBaseAttributeCodes, Collections.emptyList());

    List<TableColumn> tableColumns =
        createTableColumns(
            dataFromBusinessModule.dataSourceName(),
            dataSource.businessModuleName(),
            dataSource.id(),
            dataFromBusinessModule.dataTableHeader().attributes(),
            indexToBaseData,
            indexToBaseReferenceAttribute.keySet());
    if (tableColumns.stream()
        .filter(tableColumn -> !tableColumn.getValueType().equals(ValueType.CENTRAL_FILE_ID))
        .findAny()
        .isEmpty()) {
      throw new BadRequestException("Statistic has no valid fields");
    }

    Statistic statistic = new Statistic();
    statistic.setName(name);
    statistic.setTimeRangeStart(timeRangeStart);
    statistic.setTimeRangeEnd(timeRangeEnd);
    statistic.addTableColumns(tableColumns);
    statistic.setNumberOfTableRows(0);
    statistic.setState(AggregationResultState.CREATING);
    statistic.setPendingState(
        dataFromBusinessModule.totalNumberOfElements() == 0
            ? AggregationResultPendingState.MIN_MAX_DETERMINATION
            : AggregationResultPendingState.DATA_AGGREGATION);

    return statistic;
  }

  private GetSpecificDataResponse getDataFromBusinessModule(
      GetSpecificDataRequest businessModuleRequest, String businessModuleName) {
    String message = "Could not retrieve data from business module";

    List<ClientResponse<GetSpecificDataResponse>> clientResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            Set.of(businessModuleName), client -> client.getSpecificData(businessModuleRequest));
    if (clientResponses.isEmpty()) {
      throw new BadRequestException(message);
    }

    ClientResponse<GetSpecificDataResponse> clientResponse = clientResponses.getFirst();
    GetSpecificDataResponse getSpecificDataResponse = clientResponse.response();
    if (getSpecificDataResponse == null) {
      ErrorResponseWithLocation errorResponseWithLocation = clientResponse.errorResponse();
      if (errorResponseWithLocation == null) {
        throw new BadRequestException(message);
      } else {
        message += ": %s".formatted(errorResponseWithLocation.message());
        throw new BadRequestException(errorResponseWithLocation.errorCode(), message);
      }
    }
    return getSpecificDataResponse;
  }

  private static Map<Integer, Attribute> findCentralFileColumns(DataTableHeader dataTableHeader) {
    return IntStream.range(0, dataTableHeader.attributes().size())
        .filter(
            index ->
                dataTableHeader
                    .attributes()
                    .get(index)
                    .valueType()
                    .equals(ValueType.CENTRAL_FILE_ID))
        .boxed()
        .collect(Collectors.toMap(index -> index, dataTableHeader.attributes()::get));
  }

  private Map<Integer, BaseStatisticsData> retrieveDataFromBase(
      Map<Integer, Attribute> indexToBaseReferenceAttribute,
      Map<String, List<String>> codeToBaseAttributeCodes,
      List<DataRow> dataRows) {
    Map<Integer, BaseStatisticsData> indexToDataFromBase = new HashMap<>();

    indexToBaseReferenceAttribute.forEach(
        (key, value) -> {
          List<String> baseAttributeCodes = codeToBaseAttributeCodes.get(value.code());
          if (baseAttributeCodes != null && value.subjectType() != null) {
            if (baseAttributeCodes.isEmpty()) {
              indexToDataFromBase.put(
                  key,
                  new BaseStatisticsData(new BaseDataTableHeader(Collections.emptyList()), null));
            } else {
              List<UUID> centralFileIds =
                  dataRows.stream()
                      .map(dataRow -> mapToUuid(dataRow.values().get(key)))
                      .filter(Objects::nonNull)
                      .toList();
              indexToDataFromBase.put(
                  key,
                  retrieveDataFromBase(value.subjectType(), baseAttributeCodes, centralFileIds));
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

  private BaseStatisticsData retrieveDataFromBase(
      SubjectType subjectType, List<String> attributeCodes, List<UUID> centralFileIds) {
    GetBaseStatisticsDataRequest baseStatisticsDataRequest =
        new GetBaseStatisticsDataRequest(subjectType.name(), attributeCodes, centralFileIds);

    GetBaseStatisticsDataResponse specificData =
        baseModuleStatisticsApi.getSpecificData(baseStatisticsDataRequest);

    return new BaseStatisticsData(specificData.dataTableHeader(), specificData.dataRows());
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
              tableColumns.add(
                  createTableColumn(
                      dataSourceName, businessModuleName, dataSourceId, attribute, null));
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

    if (baseModuleAttribute == null) {
      tableColumn.setValueType(businessModuleAttribute.valueType());
      tableColumn.setSubjectType(businessModuleAttribute.subjectType());
      tableColumn.setUnit(businessModuleAttribute.unit());
      tableColumn.addValueToMeanings(
          StatisticMapper.mapToPersistence(businessModuleAttribute.valueOptions()));
      tableColumn.setMandatory(businessModuleAttribute.mandatory());
    } else {
      tableColumn.setBaseModuleAttributeCode(baseModuleAttribute.code());
      tableColumn.setBaseModuleAttributeName(baseModuleAttribute.name());
      tableColumn.setValueType(baseModuleAttribute.valueType());
      tableColumn.setUnit(baseModuleAttribute.unit());
      tableColumn.addValueToMeanings(
          StatisticMapper.mapToPersistence(baseModuleAttribute.valueOptions()));
      tableColumn.setMandatory(baseModuleAttribute.mandatory());
    }

    tableColumn.setSearchKey(
        AttributeSelectionMapper.buildSearchKey(
            tableColumn.getBusinessModuleAttributeCode(),
            tableColumn.getDataSourceId(),
            tableColumn.getBusinessModuleName(),
            tableColumn.getBaseModuleAttributeCode()));

    return tableColumn;
  }

  private static List<TableColumn> createTableColumnsForBaseAttributes(
      String dataSourceName,
      String businessModuleName,
      UUID dataSourceId,
      Attribute businessAttribute,
      List<BaseAttribute> baseAttributes) {
    List<BaseAttribute> responseBaseAttributes =
        baseAttributes.stream()
            .filter(baseAttribute -> !baseAttribute.valueType().equals(ValueType.CENTRAL_FILE_ID))
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
    Long tableRowsCount = countTableRows(aggregationResult);
    int page = (int) (tableRowsCount / pageSizeForBusinessModuleDataRequest);
    int ignoreTableRowsCount = (int) (tableRowsCount % pageSizeForBusinessModuleDataRequest);

    TableColumn firstTableColumn = aggregationResult.getTableColumns().getFirst();
    List<String> attributeCodes =
        aggregationResult.getTableColumns().stream()
            .filter(tableColumn -> tableColumn.getBaseModuleAttributeCode() == null)
            .map(TableColumn::getBusinessModuleAttributeCode)
            .toList();
    GetSpecificDataRequest request =
        new GetSpecificDataRequest(
            aggregationResult.getTimeRangeStart(),
            aggregationResult.getTimeRangeEnd(),
            firstTableColumn.getDataSourceId(),
            attributeCodes,
            page,
            pageSizeForBusinessModuleDataRequest);

    GetSpecificDataResponse dataFromBusinessModule =
        getDataFromBusinessModule(request, firstTableColumn.getBusinessModuleName());

    Map<Integer, Attribute> indexToBaseReferenceAttribute =
        findCentralFileColumns(dataFromBusinessModule.dataTableHeader());

    Map<String, List<String>> codeToBaseAttributeCodes =
        getCodeToBaseAttributeCodesMap(aggregationResult.getTableColumns());
    Map<Integer, BaseStatisticsData> indexToBaseData =
        retrieveDataFromBase(
            indexToBaseReferenceAttribute,
            codeToBaseAttributeCodes,
            dataFromBusinessModule.dataRows());

    validateSameTableColumns(
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

    for (DataRow dataRow : relevantDataRows) {
      createAndAddTableRow(
          aggregationResult,
          dataFromBusinessModule.dataTableHeader(),
          dataRow,
          indexToBaseReferenceAttribute,
          indexToBaseData);
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

  public Long countTableRows(AbstractAggregationResult aggregationResult) {
    return tableRowRepository.countTableRowByAggregationResult(aggregationResult);
  }

  private static Map<String, List<String>> getCodeToBaseAttributeCodesMap(
      List<TableColumn> tableColumns) {
    Set<String> centralFileCodes =
        tableColumns.stream()
            .filter(tableColumn -> tableColumn.getValueType().equals(ValueType.CENTRAL_FILE_ID))
            .map(TableColumn::getBusinessModuleAttributeCode)
            .collect(Collectors.toSet());

    Map<String, List<String>> codeToBaseAttributeCodes = new HashMap<>();
    centralFileCodes.forEach(
        code -> {
          List<String> baseCodes =
              tableColumns.stream()
                  .filter(
                      tableColumn ->
                          tableColumn.getBusinessModuleAttributeCode().equals(code)
                              && tableColumn.getBaseModuleAttributeCode() != null)
                  .map(TableColumn::getBaseModuleAttributeCode)
                  .toList();
          codeToBaseAttributeCodes.put(code, baseCodes);
        });
    return codeToBaseAttributeCodes;
  }

  private static void validateSameTableColumns(
      AbstractAggregationResult aggregationResult, List<TableColumn> newTableColumns) {
    String errorMessage =
        "Different data structure from business module during aggregation %s"
            .formatted(aggregationResult.getExternalId());
    if (aggregationResult.getTableColumns().size() != newTableColumns.size()) {
      throw new BadRequestException(errorMessage);
    }
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
        || !Objects.equals(firstTableColumn.getSubjectType(), secondTableColumn.getSubjectType())
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

  private void createAndAddTableRow(
      AbstractAggregationResult aggregationResult,
      DataTableHeader dataTableHeader,
      DataRow dataRow,
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
                                  !baseAttribute.valueType().equals(ValueType.CENTRAL_FILE_ID))
                          .toList()
                          .size();
                  mergeInformation.indexToNumberOfBaseColumns().put(index, baseAttributeSize);
                }
              }
            });

    Map<Integer, Map<UUID, DataRow>> indexToCentralFileIdRows =
        indexToBaseData.entrySet().stream()
            .collect(
                Collectors.toMap(
                    Map.Entry::getKey,
                    entry ->
                        createCentralFileIdMap(
                            entry.getValue().dataTableHeader().attributes(),
                            entry.getValue().dataRows())));

    aggregationResult.addTableRow(
        createMergedTableRow(
            dataRow,
            indexToCentralFileIdRows,
            mergeInformation,
            aggregationResult.getTableColumns()));
  }

  private Map<UUID, DataRow> createCentralFileIdMap(
      List<BaseAttribute> attributes, List<DataRow> dataRows) {
    if (dataRows == null) {
      return new HashMap<>();
    }

    int indexCentralFileId = getIndexCentralFileId(attributes);
    Map<UUID, DataRow> centralFileIdToRow = new HashMap<>();
    dataRows.forEach(
        row -> {
          List<Object> objects = new ArrayList<>(row.values());
          UUID uuid = mapToUuid(objects.remove(indexCentralFileId));
          centralFileIdToRow.put(uuid, new DataRow(objects));
        });

    return centralFileIdToRow;
  }

  private static int getIndexCentralFileId(List<BaseAttribute> attributes) {
    return IntStream.range(0, attributes.size())
        .filter(index -> attributes.get(index).valueType().equals(ValueType.CENTRAL_FILE_ID))
        .findFirst()
        .orElse(-1);
  }

  private static TableRow createMergedTableRow(
      DataRow dataRow,
      Map<Integer, Map<UUID, DataRow>> indexToCentralFileIdRows,
      MergeInformation mergeInformation,
      List<TableColumn> tableColumns) {
    List<Object> values = new ArrayList<>();
    IntStream.range(0, dataRow.values().size())
        .forEach(
            index -> {
              Object value = dataRow.values().get(index);
              values.add(value);
              if (mergeInformation.baseReferenceIndexes().contains(index)) {
                Map<UUID, DataRow> uuidDataRowMap = indexToCentralFileIdRows.get(index);
                UUID uuid = mapToUuid(value);
                if (uuid == null || uuidDataRowMap.get(uuid) == null) {
                  addNullValues(values, mergeInformation.indexToNumberOfBaseColumns.get(index));
                } else {
                  values.addAll(uuidDataRowMap.get(uuid).values());
                }
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

  private static CellEntry createCellEntry(Object value, TableColumn tableColumn) {
    CellEntry cellEntry =
        switch (tableColumn.getValueType()) {
          case BOOLEAN -> createBooleanEntry(value);
          case DATE -> createDateEntry(value);
          case DECIMAL -> createDecimalEntry(value);
          case INTEGER -> createIntegerEntry(value);
          case TEXT, VALUE_WITH_OPTIONS -> createTextEntry(value);
          case PROCEDURE_ID, CENTRAL_FILE_ID -> createUuidEntry(value);
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

  private static DateEntry createDateEntry(Object value) {
    DateEntry entry = new DateEntry();
    if (value instanceof String stringValue) {
      try {
        entry.setDateValue(LocalDate.parse(stringValue));
      } catch (DateTimeParseException ignored) {
        // ignore broken value
      }
    }
    return entry;
  }

  private static DecimalEntry createDecimalEntry(Object value) {
    DecimalEntry entry = new DecimalEntry();
    if (value instanceof Double doubleValue) {
      entry.setBigDecimalValue(BigDecimal.valueOf(doubleValue));
    }

    if (value instanceof Integer integerValue) {
      entry.setBigDecimalValue(BigDecimal.valueOf(integerValue));
    }
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
    if (value instanceof String stringValue) {
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
    for (TableColumn tableColumn : aggregationResult.getTableColumns()) {
      MinMaxNullUnknownValues minMaxNullUnknownValues =
          switch (tableColumn.getValueType()) {
            case BOOLEAN -> determineNullValuesBoolean(tableColumn);
            case DATE -> determineNullUnknownValuesDate(tableColumn);
            case DECIMAL -> determineNullUnknownValuesDecimal(tableColumn);
            case INTEGER -> determineNullUnknownValuesInteger(tableColumn);
            case TEXT, VALUE_WITH_OPTIONS -> determineNullUnknownValuesText(tableColumn);
            case CENTRAL_FILE_ID, PROCEDURE_ID -> null;
          };
      tableColumn.setMinMaxNullUnknownValues(minMaxNullUnknownValues);
    }
    aggregationResult.setPendingState(AggregationResultPendingState.EVALUATION_CONDUCTION);
  }

  private MinMaxNullUnknownValues determineNullValuesBoolean(TableColumn tableColumn) {
    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(
            AggregationResultSpecifications.getNullSpecification(tableColumn)));
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
        tableRowRepository.count(
            AggregationResultSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                AggregationResultSpecifications.getEqualDateSpecification(
                    tableColumn, unknownValue)));
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

  private MinMaxNullUnknownValues determineNullUnknownValuesDecimal(TableColumn tableColumn) {
    BigDecimal unknownValue = getUnknownNumberValue(tableColumn, BigDecimal::new);

    BigDecimal minValue = cellEntryRepository.findDecimalValueMin(tableColumn, unknownValue);
    BigDecimal maxValue = cellEntryRepository.findDecimalValueMax(tableColumn, unknownValue);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setMinDecimal(minValue);
    minMaxNullUnknownValues.setMaxDecimal(maxValue);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(
            AggregationResultSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                AggregationResultSpecifications.getDecimalValueFilterSpecification(
                    tableColumn, unknownValue, NumericComparisonDto.EQUAL, false)));
    minMaxNullUnknownValues.setUnknownValue(unknownValue == null ? null : unknownValue.toString());

    return minMaxNullUnknownValues;
  }

  private MinMaxNullUnknownValues determineNullUnknownValuesInteger(TableColumn tableColumn) {
    Integer unknownValue = getUnknownNumberValue(tableColumn, Integer::parseInt);

    Integer minValue = cellEntryRepository.findIntegerValueMin(tableColumn, unknownValue);
    Integer maxValue = cellEntryRepository.findIntegerValueMax(tableColumn, unknownValue);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setMinInteger(minValue);
    minMaxNullUnknownValues.setMaxInteger(maxValue);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(
            AggregationResultSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                AggregationResultSpecifications.getIntegerValueFilterSpecification(
                    tableColumn, unknownValue, NumericComparisonDto.EQUAL, false)));
    minMaxNullUnknownValues.setUnknownValue(unknownValue == null ? null : unknownValue.toString());

    return minMaxNullUnknownValues;
  }

  private MinMaxNullUnknownValues determineNullUnknownValuesText(TableColumn tableColumn) {
    String unknownValue =
        getUnknownValueOptional(tableColumn).map(ValueToMeaning::getValue).orElse(null);

    MinMaxNullUnknownValues minMaxNullUnknownValues = getOrCreateMinMax(tableColumn);
    minMaxNullUnknownValues.setNumberOfNullEntries(
        tableRowRepository.count(
            AggregationResultSpecifications.getNullSpecification(tableColumn)));
    minMaxNullUnknownValues.setNumberOfUnknownEntries(
        unknownValue == null
            ? null
            : tableRowRepository.count(
                AggregationResultSpecifications.getTextFilterSpecification(
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
          case Statistic statistic -> {
            logData.put("User-ID", statistic.getCreatedByUserId().toString());
            yield "Erstellen einer Statistik";
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

  public void removeTableRows(Statistic statistic) {
    tableRowRepository.deleteAll(
        tableRowRepository
            .findAllByAggregationResult(
                statistic, Pageable.ofSize(pageSizeForBusinessModuleDataRequest))
            .getContent());
  }

  private record BaseStatisticsData(BaseDataTableHeader dataTableHeader, List<DataRow> dataRows) {}

  private record MergeInformation(
      Set<Integer> baseReferenceIndexes, Map<Integer, Integer> indexToNumberOfBaseColumns) {}
}
