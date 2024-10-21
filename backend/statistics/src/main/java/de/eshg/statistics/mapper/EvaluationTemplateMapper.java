/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.api.AvailableDataSource;
import de.eshg.statistics.api.BaseDataSourceAttribute;
import de.eshg.statistics.api.BusinessDataAttribute;
import de.eshg.statistics.api.BusinessDataSourceAttribute;
import de.eshg.statistics.api.DataSourceDto;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.evaluationtemplate.AnalysisInfo;
import de.eshg.statistics.api.evaluationtemplate.BaseDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.BusinessDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.DataSourceWithAttributeNames;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.datatransfer.AnalysisTemplateData;
import de.eshg.statistics.datatransfer.DiagramTemplateData;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.exception.InvalidDataSourceException;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.evaluationtemplate.AnalysisTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.BaseDataAttribute;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataAttribute;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DiagramTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import java.util.List;
import org.hibernate.Hibernate;

public class EvaluationTemplateMapper {

  private EvaluationTemplateMapper() {}

  public static EvaluationTemplate mapToPersistence(
      String name,
      EvaluationTemplateData evaluationTemplateData,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate =
        mapToPersistence(name, evaluationTemplateData.dataSources(), availableDataSources);
    evaluationTemplate.addAnalysisTemplates(
        evaluationTemplateData.analysisTemplateDatas().stream()
            .map(EvaluationTemplateMapper::mapToAnalysisTemplate)
            .toList());
    return evaluationTemplate;
  }

  private static AnalysisTemplate mapToAnalysisTemplate(AnalysisTemplateData analysisTemplateData) {
    AnalysisTemplate analysisTemplate = new AnalysisTemplate();
    analysisTemplate.setName(analysisTemplateData.name());
    analysisTemplate.setChartConfiguration(
        EvaluationMapper.mapToPersistence(analysisTemplateData.chartConfiguration()));
    analysisTemplate.addDiagramTemplates(
        analysisTemplateData.diagramTemplateDatas().stream()
            .map(EvaluationTemplateMapper::mapToDiagramTemplate)
            .toList());
    return analysisTemplate;
  }

  private static DiagramTemplate mapToDiagramTemplate(DiagramTemplateData diagramTemplateData) {
    DiagramTemplate diagramTemplate = new DiagramTemplate();
    diagramTemplate.setTitle(diagramTemplateData.title());
    diagramTemplate.setDescription(diagramTemplateData.description());
    diagramTemplate.addFilters(
        diagramTemplateData.filters().stream()
            .map(FilterParameterMapper::mapToPersistence)
            .toList());
    return diagramTemplate;
  }

  public static EvaluationTemplate mapToPersistence(
      String name,
      List<DataSourceDto> dataSourceDtos,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate = new EvaluationTemplate();
    evaluationTemplate.setName(name);
    evaluationTemplate.addDataSources(
        dataSourceDtos.stream()
            .map(dataSourceDto -> mapToPersistence(dataSourceDto, availableDataSources))
            .toList());
    return evaluationTemplate;
  }

  private static DataSource mapToPersistence(
      DataSourceDto dataSourceDto, List<AvailableDataSource> availableDataSources) {
    AvailableDataSource availableDataSource =
        availableDataSources.stream()
            .filter(
                source ->
                    source.id().equals(dataSourceDto.id())
                        && source.businessModule().equals(dataSourceDto.businessModuleName()))
            .findFirst()
            .orElseThrow(InvalidDataSourceException::new);

    DataSource dataSource = new DataSource();
    dataSource.setBusinessModuleName(dataSourceDto.businessModuleName());
    dataSource.setExternalDataSourceId(dataSourceDto.id());
    dataSource.setDataSourceName(availableDataSource.name());
    dataSource.addAttributes(
        dataSourceDto.attributeCodes().stream()
            .map(
                businessDataAttribute ->
                    mapToPersistence(businessDataAttribute, availableDataSource))
            .toList());
    return dataSource;
  }

  private static DataAttribute mapToPersistence(
      BusinessDataAttribute businessDataAttribute, AvailableDataSource availableDataSource) {
    BusinessDataSourceAttribute businessDataSourceAttribute =
        availableDataSource.attributes().stream()
            .filter(attribute -> attribute.code().equals(businessDataAttribute.code()))
            .findFirst()
            .orElseThrow(InvalidDataSourceException::new);

    DataAttribute dataAttribute = new DataAttribute();
    dataAttribute.setCode(businessDataAttribute.code());
    dataAttribute.setName(businessDataSourceAttribute.name());
    dataAttribute.addBaseAttributes(
        businessDataAttribute.baseAttributeCodes().stream()
            .map(code -> mapToBaseDataAttribute(code, businessDataSourceAttribute))
            .toList());
    return dataAttribute;
  }

  private static BaseDataAttribute mapToBaseDataAttribute(
      String code, BusinessDataSourceAttribute businessDataSourceAttribute) {
    BaseDataSourceAttribute baseDataSourceAttribute =
        businessDataSourceAttribute.baseAttributes().stream()
            .filter(attribute -> attribute.code().equals(code))
            .findFirst()
            .orElseThrow(InvalidDataSourceException::new);

    BaseDataAttribute baseDataAttribute = new BaseDataAttribute();
    baseDataAttribute.setCode(code);
    baseDataAttribute.setName(baseDataSourceAttribute.name());
    return baseDataAttribute;
  }

  public static EvaluationTemplateDto mapToApi(EvaluationTemplate evaluationTemplate) {
    List<DataSourceWithAttributeNames> dataSources =
        mapToDataSourceDtos(evaluationTemplate.getDataSources());

    return new EvaluationTemplateDto(
        evaluationTemplate.getExternalId(),
        evaluationTemplate.getName(),
        dataSources,
        mapToAnalysisInfos(evaluationTemplate.getAnalysisTemplates()),
        evaluationTemplate.getCreatedAt(),
        evaluationTemplate.getLastUsageAt());
  }

  private static List<DataSourceWithAttributeNames> mapToDataSourceDtos(
      List<DataSource> dataSources) {
    return dataSources.stream().map(EvaluationTemplateMapper::mapToDataSourceDto).toList();
  }

  private static DataSourceWithAttributeNames mapToDataSourceDto(DataSource dataSource) {

    return new DataSourceWithAttributeNames(
        dataSource.getBusinessModuleName(),
        dataSource.getExternalDataSourceId(),
        dataSource.getAttributes().stream()
            .map(EvaluationTemplateMapper::mapToBusinessDataAttribute)
            .toList());
  }

  private static BusinessDataAttributeWithName mapToBusinessDataAttribute(
      DataAttribute dataAttribute) {
    return new BusinessDataAttributeWithName(
        dataAttribute.getCode(),
        dataAttribute.getName(),
        dataAttribute.getBaseAttributes().stream()
            .map(EvaluationTemplateMapper::mapToBaseDataAttribute)
            .toList());
  }

  private static BaseDataAttributeWithName mapToBaseDataAttribute(
      BaseDataAttribute baseDataAttribute) {
    return new BaseDataAttributeWithName(baseDataAttribute.getCode(), baseDataAttribute.getName());
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
