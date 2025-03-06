/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetDataInformationRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.DateAttribute;
import de.eshg.lib.statistics.attributes.DecimalAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.lib.statistics.datasource.DataSource;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatistics;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatisticsRepository;
import de.eshg.lib.statistics.util.DataRowPage;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class StatisticsService {
  private final ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository;
  private final List<DataSource<?>> dataSources;

  public StatisticsService(
      ProcedureReferenceForStatisticsRepository procedureReferenceForStatisticsRepository,
      List<DataSource<?>> dataSources) {
    Assert.notEmpty(dataSources, "dataSources must not be empty");
    this.procedureReferenceForStatisticsRepository = procedureReferenceForStatisticsRepository;
    this.dataSources =
        dataSources.stream().sorted(Comparator.comparing(DataSource::getName)).toList();
  }

  public List<DataSource<?>> getDataSources() {
    return dataSources;
  }

  public final List<Attribute> getAttributes(DataSource<?> dataSource) {
    return dataSource.getAttributes().stream()
        .map(AttributeInfo::getAttributeData)
        .map(this::mapToAttribute)
        .toList();
  }

  private Attribute mapToAttribute(AttributeData attribute) {
    return new Attribute(
        attribute.getName(),
        attribute.getCode(),
        mapToValueType(attribute),
        attribute.getUnit(),
        attribute.getValueOptions(),
        attribute.getCategory(),
        attribute.isMandatory(),
        attribute.getDataPrivacyCategory());
  }

  private static ValueType mapToValueType(AttributeData attribute) {
    return switch (attribute) {
      case BooleanAttribute ignored -> ValueType.BOOLEAN;
      case IntegerAttribute ignored -> ValueType.INTEGER;
      case CentralFileIdFacilityAttribute ignored -> ValueType.CENTRAL_FILE_ID_FACILITY;
      case CentralFileIdPersonAttribute ignored -> ValueType.CENTRAL_FILE_ID_PERSON;
      case ContactIdAttribute ignored -> ValueType.CONTACT_ID;
      case DateAttribute ignored -> ValueType.DATE;
      case DecimalAttribute ignored -> ValueType.DECIMAL;
      case ProcedureAttribute ignored -> ValueType.PROCEDURE_REFERENCE;
      case TextAttribute ignored -> ValueType.TEXT;
      case ValueWithOptionsAttribute ignored -> ValueType.VALUE_WITH_OPTIONS;
    };
  }

  public final GetDataTableHeaderResponse getDataTableHeader(
      GetDataTableHeaderRequest getDataTableHeaderRequest) {
    GetSpecificDataResponse specificDataResponse =
        getSpecificDataResponse(getDataTableHeaderRequest, ignored -> DataRowPage.empty());
    return new GetDataTableHeaderResponse(
        specificDataResponse.dataSourceName(),
        specificDataResponse.timeRangeStart(),
        specificDataResponse.timeRangeEnd(),
        specificDataResponse.sensitivity(),
        specificDataResponse.dataTableHeader());
  }

  public final GetSpecificDataResponse getSpecificData(
      GetSpecificDataRequest getSpecificDataRequest) {
    return getSpecificDataResponse(
        getSpecificDataRequest,
        dataForDataRowRetrieval ->
            getDataRowPage(
                dataForDataRowRetrieval.dataSource(),
                getSpecificDataRequest,
                dataForDataRowRetrieval.requestedAttributeInfos(),
                dataForDataRowRetrieval.dataTableHeader()));
  }

  private GetSpecificDataResponse getSpecificDataResponse(
      GetDataInformationRequest getDataInformationRequest,
      Function<DataForDataRowRetrieval, DataRowPage> dataRowPageFunction) {
    if (!getDataInformationRequest
        .timeRangeStart()
        .isBefore(getDataInformationRequest.timeRangeEnd())) {
      throw new BadRequestException("Time range is invalid: start not before end");
    }

    @SuppressWarnings("unchecked")
    DataSource<AttributeInfo> dataSource =
        (DataSource<AttributeInfo>) getDataSource(getDataInformationRequest.dataSourceId());

    List<AttributeInfo> requestedAttributeInfos =
        getRequestedAttributeInfos(getDataInformationRequest.attributeCodes(), dataSource);

    DataTableHeader dataTableHeader = getDataTableHeader(requestedAttributeInfos);

    DataRowPage dataRowPage =
        dataRowPageFunction.apply(
            new DataForDataRowRetrieval(dataSource, requestedAttributeInfos, dataTableHeader));

    return new GetSpecificDataResponse(
        dataSource.getName(),
        getDataInformationRequest.timeRangeStart(),
        getDataInformationRequest.timeRangeEnd(),
        dataSource.getSensitivity(),
        dataTableHeader,
        dataRowPage.dataRows(),
        dataRowPage.totalNumberOfElements());
  }

  private DataSource<?> getDataSource(UUID dataSourceId) {
    return dataSources.stream()
        .filter(dataSourceInfo -> dataSourceInfo.getId().equals(dataSourceId))
        .collect(StreamUtil.toSingleOptionalElement())
        .orElseThrow(() -> new NotFoundException("Data source with given id not found"));
  }

  private <A extends AttributeInfo> List<A> getRequestedAttributeInfos(
      List<String> attributeCodes, DataSource<A> dataSource) {
    return attributeCodes.stream()
        .map(dataSource::findAttribute)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .toList();
  }

  private <A extends AttributeInfo> DataRowPage getDataRowPage(
      DataSource<A> dataSource,
      GetSpecificDataRequest getSpecificDataRequest,
      List<A> requestedAttributeInfos,
      DataTableHeader dataTableHeader) {
    if (requestedAttributeInfos.isEmpty()) {
      return DataRowPage.empty();
    }

    List<ProcedureReferenceForStatistics> procedureReferences = new ArrayList<>();
    DataRowPage dataRowPage =
        dataSource.getDataRowPage(
            requestedAttributeInfos,
            dataTableHeader,
            TimeRange.fromRequest(getSpecificDataRequest),
            getSpecificDataRequest.page(),
            getSpecificDataRequest.pageSize(),
            procedureReferences);

    procedureReferenceForStatisticsRepository.saveAll(procedureReferences);
    return dataRowPage;
  }

  private DataTableHeader getDataTableHeader(
      List<? extends AttributeInfo> requestedAttributeInfos) {
    return new DataTableHeader(
        requestedAttributeInfos.stream()
            .map(AttributeInfo::getAttributeData)
            .map(this::mapToAttribute)
            .toList());
  }

  private record DataForDataRowRetrieval(
      DataSource<AttributeInfo> dataSource,
      List<AttributeInfo> requestedAttributeInfos,
      DataTableHeader dataTableHeader) {}
}
