/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.DateAttribute;
import de.eshg.lib.statistics.attributes.DecimalAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.lib.statistics.datasource.DataSource;
import de.eshg.lib.statistics.util.DataRowPage;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class StatisticsService {
  private final List<DataSource<?>> dataSources;

  public StatisticsService(List<DataSource<?>> dataSources) {
    Assert.notEmpty(dataSources, "dataSources must not be empty");
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
        attribute.isMandatory());
  }

  private static ValueType mapToValueType(AttributeData attribute) {
    return switch (attribute) {
      case BooleanAttribute ignored -> ValueType.BOOLEAN;
      case IntegerAttribute ignored -> ValueType.INTEGER;
      case CentralFileIdFacilityAttribute ignored -> ValueType.CENTRAL_FILE_ID_FACILITY;
      case CentralFileIdPersonAttribute ignored -> ValueType.CENTRAL_FILE_ID_PERSON;
      case DateAttribute ignored -> ValueType.DATE;
      case DecimalAttribute ignored -> ValueType.DECIMAL;
      case ProcedureAttribute ignored -> ValueType.PROCEDURE_ID;
      case TextAttribute ignored -> ValueType.TEXT;
      case ValueWithOptionsAttribute ignored -> ValueType.VALUE_WITH_OPTIONS;
    };
  }

  public final GetSpecificDataResponse getSpecificData(
      GetSpecificDataRequest getSpecificDataRequest) {
    if (!getSpecificDataRequest.timeRangeStart().isBefore(getSpecificDataRequest.timeRangeEnd())) {
      throw new BadRequestException("Time range is invalid: start not before end");
    }

    @SuppressWarnings("unchecked")
    DataSource<AttributeInfo> dataSource =
        (DataSource<AttributeInfo>) getDataSource(getSpecificDataRequest.dataSourceId());
    if (getSpecificDataRequest.anonymizationRequired() && !dataSource.isCanBeAnonymized()) {
      throw new BadRequestException("Data cannot be anonymized");
    }

    List<AttributeInfo> requestedAttributeInfos =
        getRequestedAttributeInfos(getSpecificDataRequest.attributeCodes(), dataSource);

    DataTableHeader dataTableHeader = getDataTableHeader(requestedAttributeInfos);

    DataRowPage dataRowPage =
        getDataRowPage(
            dataSource, getSpecificDataRequest, requestedAttributeInfos, dataTableHeader);

    return new GetSpecificDataResponse(
        dataSource.getName(),
        getSpecificDataRequest.timeRangeStart(),
        getSpecificDataRequest.timeRangeEnd(),
        dataSource.getSensitivity(),
        getSpecificDataRequest.anonymizationRequired(),
        dataTableHeader,
        getSpecificDataRequest.anonymizationRequired()
            ? dataSource.bulkAnonymizeDataRows(dataTableHeader, dataRowPage.dataRows())
            : dataRowPage.dataRows(),
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

    return dataSource.getDataRowPage(
        requestedAttributeInfos,
        dataTableHeader,
        TimeRange.fromRequest(getSpecificDataRequest),
        getSpecificDataRequest.page(),
        getSpecificDataRequest.pageSize());
  }

  private DataTableHeader getDataTableHeader(
      List<? extends AttributeInfo> requestedAttributeInfos) {
    return new DataTableHeader(
        requestedAttributeInfos.stream()
            .map(AttributeInfo::getAttributeData)
            .map(this::mapToAttribute)
            .toList());
  }
}
