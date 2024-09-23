/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.AttributeCodeToNameMapping;
import de.eshg.statistics.api.AddStatisticsSchemeRequest;
import de.eshg.statistics.api.BaseDataAttributeWithName;
import de.eshg.statistics.api.BusinessDataAttribute;
import de.eshg.statistics.api.BusinessDataAttributeWithName;
import de.eshg.statistics.api.DataSourceDto;
import de.eshg.statistics.api.DataSourceWithAttributeNames;
import de.eshg.statistics.api.StatisticsSchemeDto;
import de.eshg.statistics.exception.InvalidDataSourceException;
import de.eshg.statistics.persistence.entity.scheme.DataAttribute;
import de.eshg.statistics.persistence.entity.scheme.DataSource;
import de.eshg.statistics.persistence.entity.scheme.StatisticsScheme;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class StatisticsSchemeMapper {

  private StatisticsSchemeMapper() {}

  public static StatisticsScheme mapToPersistence(
      AddStatisticsSchemeRequest addStatisticsSchemeRequest) {
    StatisticsScheme statisticsScheme = new StatisticsScheme();
    statisticsScheme.setName(addStatisticsSchemeRequest.name());
    statisticsScheme.addDataSources(mapToPersistence(addStatisticsSchemeRequest.dataSources()));
    return statisticsScheme;
  }

  private static List<DataSource> mapToPersistence(List<DataSourceDto> dataSourceDtos) {
    return dataSourceDtos.stream().map(StatisticsSchemeMapper::mapToPersistence).toList();
  }

  private static DataSource mapToPersistence(DataSourceDto dataSourceDto) {
    DataSource dataSource = new DataSource();
    dataSource.setBusinessModuleName(dataSourceDto.businessModuleName());
    dataSource.setExternalDataSourceId(dataSourceDto.id());
    dataSource.addAttributes(
        dataSourceDto.attributeCodes().stream()
            .map(StatisticsSchemeMapper::mapToPersistence)
            .toList());
    return dataSource;
  }

  private static DataAttribute mapToPersistence(BusinessDataAttribute businessDataAttribute) {
    DataAttribute dataAttribute = new DataAttribute();
    dataAttribute.setCode(businessDataAttribute.code());
    dataAttribute.addBaseAttributeCodes(businessDataAttribute.baseAttributeCodes());
    return dataAttribute;
  }

  public static StatisticsSchemeDto mapToApi(
      StatisticsScheme statisticsScheme,
      Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappingsByDataSourceId) {
    List<DataSourceWithAttributeNames> dataSources;
    try {
      dataSources =
          mapToDataSourceDtos(statisticsScheme.getDataSources(), codeToNameMappingsByDataSourceId);
    } catch (InvalidDataSourceException e) {
      dataSources = new ArrayList<>();
    }

    return new StatisticsSchemeDto(
        statisticsScheme.getExternalId(),
        statisticsScheme.getName(),
        dataSources,
        statisticsScheme.getCreatedAt(),
        statisticsScheme.getLastUsageAt());
  }

  private static List<DataSourceWithAttributeNames> mapToDataSourceDtos(
      List<DataSource> dataSources,
      Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappingsByDataSourceId) {
    return dataSources.stream()
        .map(
            dataSource ->
                StatisticsSchemeMapper.mapToDataSourceDto(
                    dataSource,
                    codeToNameMappingsByDataSourceId.get(dataSource.getExternalDataSourceId())))
        .toList();
  }

  private static DataSourceWithAttributeNames mapToDataSourceDto(
      DataSource dataSource, List<AttributeCodeToNameMapping> attributeCodeToNameMappings) {
    if (attributeCodeToNameMappings == null) {
      throw new InvalidDataSourceException();
    }

    return new DataSourceWithAttributeNames(
        dataSource.getBusinessModuleName(),
        dataSource.getExternalDataSourceId(),
        dataSource.getAttributes().stream()
            .map(
                attribute ->
                    StatisticsSchemeMapper.mapToBusinessDataAttribute(
                        attribute, attributeCodeToNameMappings))
            .toList());
  }

  private static BusinessDataAttributeWithName mapToBusinessDataAttribute(
      DataAttribute dataAttribute, List<AttributeCodeToNameMapping> attributeCodeToNameMappings) {
    String businessAttributeCode = dataAttribute.getCode();

    return Optional.ofNullable(attributeCodeToNameMappings)
        .flatMap(
            mappings ->
                mappings.stream()
                    .filter(
                        mapping -> mapping.businessAttributeCode().equals(businessAttributeCode))
                    .findFirst())
        .map(
            attributeCodeToNameMapping ->
                new BusinessDataAttributeWithName(
                    attributeCodeToNameMapping.businessAttributeCode(),
                    attributeCodeToNameMapping.businessAttributeName(),
                    dataAttribute.getBaseAttributeCodes().stream()
                        .map(
                            baseAttributeCode ->
                                StatisticsSchemeMapper.mapToBaseDataAttribute(
                                    baseAttributeCode, attributeCodeToNameMapping.baseAttributes()))
                        .toList()))
        .orElseThrow(InvalidDataSourceException::new);
  }

  private static BaseDataAttributeWithName mapToBaseDataAttribute(
      String baseAttributeCode, @NotNull Map<String, String> baseAttributeCodeToNameMap) {
    return Optional.ofNullable(baseAttributeCodeToNameMap.get(baseAttributeCode))
        .map(name -> new BaseDataAttributeWithName(baseAttributeCode, name))
        .orElseThrow(InvalidDataSourceException::new);
  }
}
