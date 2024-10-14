/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.AttributeCodeToNameMapping;
import de.eshg.statistics.api.BusinessDataAttribute;
import de.eshg.statistics.api.DataSourceDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateRequest;
import de.eshg.statistics.api.evaluationtemplate.AnalysisInfo;
import de.eshg.statistics.api.evaluationtemplate.BaseDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.BusinessDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.DataSourceWithAttributeNames;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.exception.InvalidDataSourceException;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.evaluationtemplate.AnalysisTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataAttribute;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DiagramTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.Hibernate;

public class EvaluationTemplateMapper {

  private EvaluationTemplateMapper() {}

  public static EvaluationTemplate mapToPersistence(
      AddEvaluationTemplateRequest addEvaluationTemplateRequest) {
    EvaluationTemplate evaluationTemplate = new EvaluationTemplate();
    evaluationTemplate.setName(addEvaluationTemplateRequest.name());
    evaluationTemplate.addDataSources(mapToPersistence(addEvaluationTemplateRequest.dataSources()));
    return evaluationTemplate;
  }

  private static List<DataSource> mapToPersistence(List<DataSourceDto> dataSourceDtos) {
    return dataSourceDtos.stream().map(EvaluationTemplateMapper::mapToPersistence).toList();
  }

  private static DataSource mapToPersistence(DataSourceDto dataSourceDto) {
    DataSource dataSource = new DataSource();
    dataSource.setBusinessModuleName(dataSourceDto.businessModuleName());
    dataSource.setExternalDataSourceId(dataSourceDto.id());
    dataSource.addAttributes(
        dataSourceDto.attributeCodes().stream()
            .map(EvaluationTemplateMapper::mapToPersistence)
            .toList());
    return dataSource;
  }

  private static DataAttribute mapToPersistence(BusinessDataAttribute businessDataAttribute) {
    DataAttribute dataAttribute = new DataAttribute();
    dataAttribute.setCode(businessDataAttribute.code());
    dataAttribute.addBaseAttributeCodes(businessDataAttribute.baseAttributeCodes());
    return dataAttribute;
  }

  public static EvaluationTemplateDto mapToApi(
      EvaluationTemplate evaluationTemplate,
      Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappingsByDataSourceId) {
    List<DataSourceWithAttributeNames> dataSources;
    try {
      dataSources =
          mapToDataSourceDtos(
              evaluationTemplate.getDataSources(), codeToNameMappingsByDataSourceId);
    } catch (InvalidDataSourceException e) {
      dataSources = new ArrayList<>();
    }

    return new EvaluationTemplateDto(
        evaluationTemplate.getExternalId(),
        evaluationTemplate.getName(),
        dataSources,
        mapToAnalysisInfos(evaluationTemplate.getAnalysisTemplates()),
        evaluationTemplate.getCreatedAt(),
        evaluationTemplate.getLastUsageAt());
  }

  private static List<DataSourceWithAttributeNames> mapToDataSourceDtos(
      List<DataSource> dataSources,
      Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappingsByDataSourceId) {
    return dataSources.stream()
        .map(
            dataSource ->
                EvaluationTemplateMapper.mapToDataSourceDto(
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
                    EvaluationTemplateMapper.mapToBusinessDataAttribute(
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
                                EvaluationTemplateMapper.mapToBaseDataAttribute(
                                    baseAttributeCode, attributeCodeToNameMapping.baseAttributes()))
                        .toList()))
        .orElseThrow(InvalidDataSourceException::new);
  }

  private static BaseDataAttributeWithName mapToBaseDataAttribute(
      String baseAttributeCode, Map<String, String> baseAttributeCodeToNameMap) {
    return Optional.ofNullable(baseAttributeCodeToNameMap.get(baseAttributeCode))
        .map(name -> new BaseDataAttributeWithName(baseAttributeCode, name))
        .orElseThrow(InvalidDataSourceException::new);
  }

  private static List<AnalysisInfo> mapToAnalysisInfos(List<AnalysisTemplate> analysisTemplates) {
    return analysisTemplates.stream()
        .map(
            analysisTemplate -> {
              String type =
                  getChartConfigurationType(
                      Hibernate.unproxy(
                          analysisTemplate.getChartConfiguration(), ChartConfiguration.class));
              return new AnalysisInfo(
                  analysisTemplate.getName(),
                  analysisTemplate.getDiagramTemplates().stream()
                      .map(DiagramTemplate::getTitle)
                      .toList(),
                  type);
            })
        .toList();
  }

  private static String getChartConfigurationType(ChartConfiguration chartConfiguration) {
    return switch (chartConfiguration) {
      case BarChartConfiguration ignored -> BarChartConfigurationDto.SCHEMA_NAME;
      case ChoroplethMapConfiguration ignored -> ChoroplethMapConfigurationDto.SCHEMA_NAME;
      case HistogramChartConfiguration ignored -> HistogramChartConfigurationDto.SCHEMA_NAME;
      case LineChartConfiguration ignored -> LineChartConfigurationDto.SCHEMA_NAME;
      case PieChartConfiguration ignored -> PieChartConfigurationDto.SCHEMA_NAME;
      case ScatterChartConfiguration ignored -> ScatterChartConfigurationDto.SCHEMA_NAME;
      default -> throw new BadRequestException("Unexpected class");
    };
  }
}
