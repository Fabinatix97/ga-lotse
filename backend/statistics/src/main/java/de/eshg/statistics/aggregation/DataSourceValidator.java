/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BaseDataSourceAttribute;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.BusinessDataSourceAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.datasource.GetAvailableDataSourcesResponse;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class DataSourceValidator {
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final DataSourceAggregationService dataSourceAggregationService;

  public DataSourceValidator(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      DataSourceAggregationService dataSourceAggregationService) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.dataSourceAggregationService = dataSourceAggregationService;
  }

  public List<AvailableDataSource> validateDataSourcesAndGetRelevantAvailableDataSources(
      List<DataSourceDto> dataSources) {
    List<AvailableDataSource> relevantAvailableDataSources =
        getRelevantAvailableDataSources(dataSources);
    validateDataSources(dataSources, relevantAvailableDataSources);
    return relevantAvailableDataSources;
  }

  private List<AvailableDataSource> getRelevantAvailableDataSources(
      List<DataSourceDto> dataSources) {
    Set<String> relevantBusinessModules = getRelevantBusinessModules(dataSources);
    validateBusinessModulesExist(relevantBusinessModules);

    GetAvailableDataSourcesResponse availableDataSources =
        dataSourceAggregationService.getAvailableDataSources(relevantBusinessModules);

    handleErrorResponses(availableDataSources);

    Set<UUID> relevantDataSources = getRelevantDataSources(dataSources);
    return availableDataSources.availableDataSources().stream()
        .filter(availableDataSource -> relevantDataSources.contains(availableDataSource.id()))
        .toList();
  }

  private void validateBusinessModulesExist(Set<String> businessModuleNames) {
    businessModuleNames.forEach(
        businessModuleAggregationHelper::validateBusinessModuleIsRegistered);
  }

  private void validateDataSources(
      List<DataSourceDto> dataSources, List<AvailableDataSource> relevantAvailableDataSources) {
    checkForAttributeDuplicates(dataSources);

    dataSources.forEach(dataSource -> validateDataSource(dataSource, relevantAvailableDataSources));
  }

  private void checkForAttributeDuplicates(List<DataSourceDto> dataSources) {
    dataSources.forEach(this::checkForBusinessAttributeDuplicates);
  }

  private void checkForBusinessAttributeDuplicates(DataSourceDto dataSource) {
    Set<String> businessAttributeCodes = new HashSet<>();
    dataSource
        .attributeCodes()
        .forEach(
            dataAttribute -> {
              if (!businessAttributeCodes.add(dataAttribute.code())) {
                throw new BadRequestException(
                    "Duplicate data attribute '%s' found for data source '%s'"
                        .formatted(dataAttribute.code(), dataSource.id()));
              }

              checkForBaseAttributesDuplicates(dataSource, dataAttribute);
            });
  }

  private void checkForBaseAttributesDuplicates(
      DataSourceDto dataSource, BusinessDataAttribute dataAttribute) {
    Set<String> baseAttributeCodes = new HashSet<>();
    dataAttribute
        .baseAttributeCodes()
        .forEach(
            baseAttribute -> {
              if (!baseAttributeCodes.add(baseAttribute)) {
                throw new BadRequestException(
                    "Duplicate base attribute '%s' found for data attribute '%s' in data source '%s'"
                        .formatted(baseAttribute, dataAttribute.code(), dataSource.id()));
              }
            });
  }

  private Set<String> getRelevantBusinessModules(List<DataSourceDto> dataSources) {
    return dataSources.stream().map(DataSourceDto::businessModuleName).collect(Collectors.toSet());
  }

  private Set<UUID> getRelevantDataSources(List<DataSourceDto> dataSources) {
    return dataSources.stream().map(DataSourceDto::id).collect(Collectors.toSet());
  }

  private void handleErrorResponses(GetAvailableDataSourcesResponse availableDataSources) {
    if (!availableDataSources.errorResponses().isEmpty()) {
      availableDataSources.errorResponses().stream()
          .findFirst()
          .ifPresent(
              errorResponseWithLocation -> {
                throw new BadRequestException(
                    errorResponseWithLocation.errorCode(),
                    "Could not validate data source for business module: %s"
                        .formatted(errorResponseWithLocation.errorLocation()));
              });
    }
  }

  private void validateDataSource(
      DataSourceDto requestDataSource, List<AvailableDataSource> availableDataSources) {
    AvailableDataSource matchingDataSource =
        availableDataSources.stream()
            .filter(
                availableDataSource ->
                    compareBusinessModuleNameAndDataSourceId(
                        availableDataSource, requestDataSource))
            .findFirst()
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "Data source '%s' not found for business module '%s'"
                            .formatted(
                                requestDataSource.id(), requestDataSource.businessModuleName())));

    validateDataAttributes(requestDataSource, matchingDataSource);
  }

  private boolean compareBusinessModuleNameAndDataSourceId(
      AvailableDataSource availableDataSource, DataSourceDto requestDataSource) {
    return availableDataSource.businessModule().equals(requestDataSource.businessModuleName())
        && availableDataSource.id().equals(requestDataSource.id());
  }

  private void validateDataAttributes(
      DataSourceDto requestDataSource, AvailableDataSource matchingDataSource) {
    requestDataSource
        .attributeCodes()
        .forEach(
            dataAttribute ->
                validateBusinessDataAttribute(
                    dataAttribute, matchingDataSource, requestDataSource.id()));
  }

  private void validateBusinessDataAttribute(
      BusinessDataAttribute requestDataAttribute,
      AvailableDataSource availableDataSource,
      UUID dataSourceId) {
    BusinessDataSourceAttribute matchingBusinessDataSourceAttribute =
        availableDataSource.attributes().stream()
            .filter(
                businessDataSourceAttribute ->
                    businessDataSourceAttribute.code().equals(requestDataAttribute.code()))
            .findFirst()
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "Business data attribute '%s' not found for data source '%s'"
                            .formatted(requestDataAttribute.code(), dataSourceId)));

    validateBaseAttributeCodes(
        requestDataAttribute, dataSourceId, matchingBusinessDataSourceAttribute);
  }

  private void validateBaseAttributeCodes(
      BusinessDataAttribute requestDataAttribute,
      UUID dataSourceId,
      BusinessDataSourceAttribute availableBusinessDataSourceAttribute) {
    if (CollectionUtils.isEmpty(requestDataAttribute.baseAttributeCodes())
        && !CollectionUtils.isEmpty(availableBusinessDataSourceAttribute.baseAttributes())) {
      throw new BadRequestException(
          "No base attribute requested for business attribute '%s' in data source '%s'"
              .formatted(requestDataAttribute.code(), dataSourceId));
    }
    if (!CollectionUtils.isEmpty(requestDataAttribute.baseAttributeCodes())
        && CollectionUtils.isEmpty(availableBusinessDataSourceAttribute.baseAttributes())) {
      throw new BadRequestException(
          "No base attribute available for business attribute '%s' in data source '%s'"
              .formatted(requestDataAttribute.code(), dataSourceId));
    }

    List<String> availableBaseAttributeCodes =
        getBaseAttributeCodes(availableBusinessDataSourceAttribute);
    requestDataAttribute
        .baseAttributeCodes()
        .forEach(
            baseAttribute -> {
              if (!availableBaseAttributeCodes.contains(baseAttribute)) {
                throw new BadRequestException(
                    "Base attribute '%s' not found for business attribute '%s' in data source '%s'"
                        .formatted(baseAttribute, requestDataAttribute.code(), dataSourceId));
              }
            });
  }

  private List<String> getBaseAttributeCodes(
      BusinessDataSourceAttribute businessDataSourceAttribute) {
    if (businessDataSourceAttribute.baseAttributes() == null) {
      return Collections.emptyList();
    }

    return businessDataSourceAttribute.baseAttributes().stream()
        .map(BaseDataSourceAttribute::code)
        .toList();
  }
}
