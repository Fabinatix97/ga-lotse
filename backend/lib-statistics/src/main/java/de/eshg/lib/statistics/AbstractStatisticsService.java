/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.SubjectType;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.util.AttributeInfo;
import de.eshg.lib.statistics.util.DataSourceInfo;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public abstract class AbstractStatisticsService<P extends Procedure<P, ?, ?, ?>> {
  private final ProcedureRepository<P> procedureRepository;

  protected AbstractStatisticsService(ProcedureRepository<P> procedureRepository) {
    this.procedureRepository = procedureRepository;
  }

  public abstract List<DataSourceInfo> getDataSourceMetaInfos();

  public final List<Attribute> getAttributes(UUID dataSourceId) {
    List<AttributeInfo> attributeInfos = getAttributeInfos(dataSourceId);

    return attributeInfos.stream().map(this::mapToAttribute).toList();
  }

  private List<AttributeInfo> getAttributeInfos(UUID dataSourceId) {
    return Optional.ofNullable(getDataSourceIdToAttributeInfos().get(dataSourceId))
        .orElseThrow(() -> getDataSourceNotFoundException(dataSourceId));
  }

  private static NotFoundException getDataSourceNotFoundException(UUID dataSourceId) {
    return new NotFoundException("Data source with id '%s' not found".formatted(dataSourceId));
  }

  protected abstract Map<UUID, List<AttributeInfo>> getDataSourceIdToAttributeInfos();

  private Attribute mapToAttribute(AttributeInfo attributeInfo) {
    if (attributeInfo.getType().equals(ValueType.CENTRAL_FILE_ID)) {
      return new Attribute(
          attributeInfo.getName(),
          attributeInfo.getCode(),
          getSubjectType(attributeInfo),
          attributeInfo.getCategory(),
          attributeInfo.isMandatory());
    } else {
      return new Attribute(
          attributeInfo.getName(),
          attributeInfo.getCode(),
          attributeInfo.getType(),
          attributeInfo.getUnit(),
          attributeInfo.getValueOptions(),
          attributeInfo.getCategory(),
          attributeInfo.isMandatory());
    }
  }

  protected abstract SubjectType getSubjectType(AttributeInfo attributeInfo);

  public final GetSpecificDataResponse getSpecificData(
      GetSpecificDataRequest getSpecificDataRequest) {
    if (!getSpecificDataRequest.timeRangeStart().isBefore(getSpecificDataRequest.timeRangeEnd())) {
      throw new BadRequestException("Time range is invalid: start not before end");
    }
    String dataSourceName =
        getDataSourceMetaInfos().stream()
            .filter(
                dataSourceInfo -> dataSourceInfo.id().equals(getSpecificDataRequest.dataSourceId()))
            .findFirst()
            .orElseThrow(
                () -> getDataSourceNotFoundException(getSpecificDataRequest.dataSourceId()))
            .name();

    List<AttributeInfo> requestedAttributeInfos =
        getRequestedAttributeInfos(
            getSpecificDataRequest.dataSourceId(), getSpecificDataRequest.attributeCodes());

    DataTableHeader dataTableHeader;
    List<DataRow> dataRows;
    long totalNumberOfRows;
    if (requestedAttributeInfos.isEmpty()) {
      dataTableHeader = new DataTableHeader(Collections.emptyList());
      dataRows = Collections.emptyList();
      totalNumberOfRows = 0;
    } else {
      Page<P> procedurePage = retrieveProcedures(getSpecificDataRequest);

      dataTableHeader =
          new DataTableHeader(requestedAttributeInfos.stream().map(this::mapToAttribute).toList());
      dataRows =
          procedurePage
              .get()
              .map(
                  procedure ->
                      createDataRow(
                          procedure,
                          requestedAttributeInfos,
                          getSpecificDataRequest.dataSourceId()))
              .toList();
      totalNumberOfRows = procedurePage.getTotalElements();
    }

    return new GetSpecificDataResponse(
        dataSourceName,
        getSpecificDataRequest.timeRangeStart(),
        getSpecificDataRequest.timeRangeEnd(),
        dataTableHeader,
        dataRows,
        totalNumberOfRows);
  }

  private List<AttributeInfo> getRequestedAttributeInfos(
      UUID dataSourceId, List<String> attributeCodes) {
    List<AttributeInfo> attributesOfDataSource = getAttributeInfos(dataSourceId);

    List<AttributeInfo> relevantAttributes = new ArrayList<>();
    attributeCodes.forEach(
        code ->
            attributesOfDataSource.stream()
                .filter(attribute -> attribute.getCode().equals(code))
                .findFirst()
                .ifPresent(relevantAttributes::add));
    return relevantAttributes;
  }

  private Page<P> retrieveProcedures(GetSpecificDataRequest getSpecificDataRequest) {
    return procedureRepository.findAll(
        getProcedureSpecification(
            getSpecificDataRequest.timeRangeStart(), getSpecificDataRequest.timeRangeEnd()),
        PageRequest.of(
            getSpecificDataRequest.page(),
            getSpecificDataRequest.pageSize(),
            Sort.by(Sort.Direction.ASC, BaseEntity_.ID)));
  }

  // probably only closed procedures are relevant
  private Specification<P> getProcedureSpecification(Instant startTimeStamp, Instant endTimeStamp) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.greaterThanOrEqualTo(root.get(Procedure_.createdAt), startTimeStamp),
            criteriaBuilder.lessThan(root.get(Procedure_.createdAt), endTimeStamp));
  }

  private DataRow createDataRow(
      P procedure, List<AttributeInfo> requestedAttributeInfos, UUID dataSourceId) {
    List<Object> values = new ArrayList<>();
    requestedAttributeInfos.forEach(
        attribute -> values.add(getSpecificValue(procedure, attribute, dataSourceId)));
    return new DataRow(values);
  }

  protected abstract Object getSpecificValue(
      P procedure, AttributeInfo attributeInfo, UUID dataSourceId);
}
