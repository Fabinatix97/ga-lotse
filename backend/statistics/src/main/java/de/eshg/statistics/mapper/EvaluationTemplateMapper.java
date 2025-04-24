/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.aggregation.DataSourceAggregationService;
import de.eshg.statistics.api.chart.BarChartConfigurationDto;
import de.eshg.statistics.api.chart.ChoroplethMapConfigurationDto;
import de.eshg.statistics.api.chart.HistogramChartConfigurationDto;
import de.eshg.statistics.api.chart.LineChartConfigurationDto;
import de.eshg.statistics.api.chart.PieChartConfigurationDto;
import de.eshg.statistics.api.chart.ScatterChartConfigurationDto;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BaseDataSourceAttribute;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.BusinessDataSourceAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.evaluationtemplate.AnalysisInfo;
import de.eshg.statistics.api.evaluationtemplate.BaseDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.BusinessDataAttributeWithName;
import de.eshg.statistics.api.evaluationtemplate.DataSourceWithAttributeNames;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateInfoDto;
import de.eshg.statistics.api.evaluationtemplate.ExpectedEvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.MinimalEvaluationTemplateInfo;
import de.eshg.statistics.api.evaluationtemplate.TemplateSensitivityInfo;
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
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;

public class EvaluationTemplateMapper {

  private EvaluationTemplateMapper() {}

  public static EvaluationTemplate mapToPersistence(
      String name,
      String description,
      EvaluationTemplateData evaluationTemplateData,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate =
        mapToPersistence(name, evaluationTemplateData.dataSources(), availableDataSources);
    evaluationTemplate.setDescription(description);
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
        AnalysisMapper.mapToPersistence(analysisTemplateData.chartConfiguration()));
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
        getAvailableDataSource(
            dataSourceDto.id(), dataSourceDto.businessModuleName(), availableDataSources);

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

  private static AvailableDataSource getAvailableDataSource(
      UUID dataSourceId,
      String businessModuleName,
      List<AvailableDataSource> availableDataSources) {
    return availableDataSources.stream()
        .filter(
            source ->
                source.id().equals(dataSourceId)
                    && source.businessModuleName().equals(businessModuleName))
        .findFirst()
        .orElseThrow(InvalidDataSourceException::new);
  }

  private static DataAttribute mapToPersistence(
      BusinessDataAttribute businessDataAttribute, AvailableDataSource availableDataSource) {
    BusinessDataSourceAttribute businessDataSourceAttribute =
        getBusinessDataSourceAttribute(businessDataAttribute.code(), availableDataSource);

    DataAttribute dataAttribute = new DataAttribute();
    dataAttribute.setCode(businessDataAttribute.code());
    dataAttribute.setName(businessDataSourceAttribute.name());
    dataAttribute.addBaseAttributes(
        businessDataAttribute.baseAttributeCodes().stream()
            .map(code -> mapToBaseDataAttribute(code, businessDataSourceAttribute))
            .toList());
    return dataAttribute;
  }

  private static BusinessDataSourceAttribute getBusinessDataSourceAttribute(
      String businessDataAttributeCode, AvailableDataSource availableDataSource) {
    return availableDataSource.attributes().stream()
        .filter(attribute -> attribute.code().equals(businessDataAttributeCode))
        .findFirst()
        .orElseThrow(InvalidDataSourceException::new);
  }

  private static BaseDataAttribute mapToBaseDataAttribute(
      String code, BusinessDataSourceAttribute businessDataSourceAttribute) {
    BaseDataSourceAttribute baseDataSourceAttribute =
        getBaseDataSourceAttribute(code, businessDataSourceAttribute);

    BaseDataAttribute baseDataAttribute = new BaseDataAttribute();
    baseDataAttribute.setCode(code);
    baseDataAttribute.setName(baseDataSourceAttribute.name());
    return baseDataAttribute;
  }

  private static BaseDataSourceAttribute getBaseDataSourceAttribute(
      String code, BusinessDataSourceAttribute businessDataSourceAttribute) {
    return businessDataSourceAttribute.baseAttributes().stream()
        .filter(attribute -> attribute.code().equals(code))
        .findFirst()
        .orElseThrow(InvalidDataSourceException::new);
  }

  public static ExpectedEvaluationTemplateDto mapToExpectedEvaluationTemplate(
      EvaluationTemplateData evaluationTemplateData,
      List<AvailableDataSource> availableDataSources) {
    List<DataSourceWithAttributeNames> dataSources =
        evaluationTemplateData.dataSources().stream()
            .map(
                dataSourceDto -> {
                  AvailableDataSource availableDataSource =
                      getAvailableDataSource(
                          dataSourceDto.id(),
                          dataSourceDto.businessModuleName(),
                          availableDataSources);
                  return new DataSourceWithAttributeNames(
                      dataSourceDto.businessModuleName(),
                      dataSourceDto.id(),
                      availableDataSource.name(),
                      mapToBusinessDataAttributes(
                          dataSourceDto.attributeCodes(), availableDataSource));
                })
            .toList();

    List<AnalysisInfo> analysisInfos =
        evaluationTemplateData.analysisTemplateDatas().stream()
            .sorted(Comparator.comparing(AnalysisTemplateData::name))
            .map(
                analysisTemplateData ->
                    new AnalysisInfo(
                        analysisTemplateData.name(),
                        analysisTemplateData.diagramTemplateDatas().stream()
                            .map(DiagramTemplateData::title)
                            .toList(),
                        analysisTemplateData.chartConfiguration().type()))
            .toList();
    return new ExpectedEvaluationTemplateDto(dataSources, analysisInfos);
  }

  private static List<BusinessDataAttributeWithName> mapToBusinessDataAttributes(
      List<BusinessDataAttribute> businessDataAttributes, AvailableDataSource availableDataSource) {
    return businessDataAttributes.stream()
        .map(
            attribute -> {
              BusinessDataSourceAttribute businessDataSourceAttribute =
                  getBusinessDataSourceAttribute(attribute.code(), availableDataSource);
              return new BusinessDataAttributeWithName(
                  businessDataSourceAttribute.code(),
                  businessDataSourceAttribute.name(),
                  businessDataSourceAttribute.dataPrivacyCategory(),
                  mapToBaseDataAttributes(
                      attribute.baseAttributeCodes(), businessDataSourceAttribute));
            })
        .toList();
  }

  private static List<BaseDataAttributeWithName> mapToBaseDataAttributes(
      List<String> codes, BusinessDataSourceAttribute businessDataSourceAttribute) {
    return codes.stream()
        .map(
            code -> {
              BaseDataSourceAttribute baseDataSourceAttribute =
                  getBaseDataSourceAttribute(code, businessDataSourceAttribute);
              return new BaseDataAttributeWithName(
                  baseDataSourceAttribute.code(),
                  baseDataSourceAttribute.displayName(),
                  baseDataSourceAttribute.dataPrivacyCategory());
            })
        .toList();
  }

  public static EvaluationTemplateInfoDto mapToInfo(
      EvaluationTemplate evaluationTemplate,
      Predicate<EvaluationTemplate> sensitiveDataAllowedForBusinessModulePredicate,
      Function<EvaluationTemplate, DataSourceSensitivity> dataSourceSensitivityFunction,
      Predicate<EvaluationTemplate> canBeAnonymizedPredicate) {
    List<String> dataSourceNames =
        evaluationTemplate.getDataSources().stream()
            .map(DataSource::getDataSourceName)
            .collect(Collectors.toSet())
            .stream()
            .sorted()
            .toList();

    DataSourceSensitivity sensitivity = dataSourceSensitivityFunction.apply(evaluationTemplate);
    return new EvaluationTemplateInfoDto(
        evaluationTemplate.getExternalId(),
        evaluationTemplate.getName(),
        new TemplateSensitivityInfo(
            DataSourceAggregationService.isSensitiveDataAllowed(
                sensitivity,
                sensitiveDataAllowedForBusinessModulePredicate.test(evaluationTemplate)),
            sensitivity,
            canBeAnonymizedPredicate.test(evaluationTemplate)),
        dataSourceNames,
        evaluationTemplate.getAnalysisCount(),
        evaluationTemplate.getCreatedByUserId(),
        evaluationTemplate.getCreatedAt(),
        evaluationTemplate.getLastUsageAt());
  }

  public static MinimalEvaluationTemplateInfo mapToMinimalInfo(
      EvaluationTemplate evaluationTemplate) {
    return new MinimalEvaluationTemplateInfo(
        evaluationTemplate.getExternalId(), evaluationTemplate.getName());
  }

  public static EvaluationTemplateDto mapToApi(
      EvaluationTemplate evaluationTemplate,
      boolean sensitiveDataAllowedForBusinessModule,
      DataSourceSensitivity sensitivity,
      boolean canBeAnonymized,
      List<AvailableDataSource> availableDataSources,
      UserDto user) {
    List<DataSourceWithAttributeNames> dataSources =
        mapToAttributesWithNames(evaluationTemplate.getDataSources(), availableDataSources);

    return new EvaluationTemplateDto(
        evaluationTemplate.getExternalId(),
        evaluationTemplate.getName(),
        evaluationTemplate.getDescription(),
        new TemplateSensitivityInfo(
            DataSourceAggregationService.isSensitiveDataAllowed(
                sensitivity, sensitiveDataAllowedForBusinessModule),
            sensitivity,
            canBeAnonymized),
        dataSources,
        mapToAnalysisInfos(evaluationTemplate.getAnalysisTemplates()),
        user,
        evaluationTemplate.getCreatedAt(),
        evaluationTemplate.getLastUsageAt());
  }

  private static List<DataSourceWithAttributeNames> mapToAttributesWithNames(
      List<DataSource> dataSources, List<AvailableDataSource> availableDataSources) {
    return dataSources.stream()
        .map(
            dataSource -> {
              AvailableDataSource availableDataSource =
                  retrieveEntityIgnoreInvalidDataSourceException(
                      availableDataSources,
                      availableDataSourceList ->
                          getAvailableDataSource(
                              dataSource.getExternalDataSourceId(),
                              dataSource.getBusinessModuleName(),
                              availableDataSourceList));
              return mapToAttributeWithNames(dataSource, availableDataSource);
            })
        .toList();
  }

  private static DataSourceWithAttributeNames mapToAttributeWithNames(
      DataSource dataSource, AvailableDataSource availableDataSource) {
    return new DataSourceWithAttributeNames(
        dataSource.getBusinessModuleName(),
        dataSource.getExternalDataSourceId(),
        dataSource.getDataSourceName(),
        dataSource.getAttributes().stream()
            .map(
                attribute -> {
                  BusinessDataSourceAttribute businessDataSourceAttribute =
                      retrieveEntityIgnoreInvalidDataSourceException(
                          availableDataSource,
                          existingAvailableDataSource ->
                              getBusinessDataSourceAttribute(
                                  attribute.getCode(), existingAvailableDataSource));
                  return mapToBusinessDataAttribute(attribute, businessDataSourceAttribute);
                })
            .toList());
  }

  private static BusinessDataAttributeWithName mapToBusinessDataAttribute(
      DataAttribute dataAttribute, BusinessDataSourceAttribute businessDataSourceAttribute) {
    return new BusinessDataAttributeWithName(
        dataAttribute.getCode(),
        dataAttribute.getName(),
        businessDataSourceAttribute == null
            ? null
            : businessDataSourceAttribute.dataPrivacyCategory(),
        dataAttribute.getBaseAttributes().stream()
            .map(
                baseDataAttribute -> {
                  BaseDataSourceAttribute baseDataSourceAttribute =
                      retrieveEntityIgnoreInvalidDataSourceException(
                          businessDataSourceAttribute,
                          existingBusinessDataSourceAttribute ->
                              getBaseDataSourceAttribute(
                                  baseDataAttribute.getCode(),
                                  existingBusinessDataSourceAttribute));
                  return mapToBaseDataAttribute(
                      dataAttribute.getName(), baseDataAttribute, baseDataSourceAttribute);
                })
            .toList());
  }

  private static BaseDataAttributeWithName mapToBaseDataAttribute(
      String businessAttributeName,
      BaseDataAttribute baseDataAttribute,
      BaseDataSourceAttribute baseDataSourceAttribute) {
    return new BaseDataAttributeWithName(
        baseDataAttribute.getCode(),
        EvaluationMapper.getAttributeDisplayName(
            businessAttributeName, baseDataAttribute.getName()),
        baseDataSourceAttribute == null ? null : baseDataSourceAttribute.dataPrivacyCategory());
  }

  private static <S, E> E retrieveEntityIgnoreInvalidDataSourceException(
      S source, Function<S, E> retrieveEntityFunction) {
    if (source == null) {
      return null;
    }
    try {
      return retrieveEntityFunction.apply(source);
    } catch (InvalidDataSourceException e) {
      // ignored
      return null;
    }
  }

  private static List<AnalysisInfo> mapToAnalysisInfos(List<AnalysisTemplate> analysisTemplates) {
    return analysisTemplates.stream()
        .sorted(
            Comparator.comparing(AnalysisTemplate::getName)
                .thenComparing(Comparator.comparing(AnalysisTemplate::getId).reversed()))
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

  public static DataSourceDto mapToDataSourceDto(DataSource dataSource) {
    return new DataSourceDto(
        dataSource.getBusinessModuleName(),
        dataSource.getExternalDataSourceId(),
        dataSource.getAttributes().stream()
            .map(EvaluationTemplateMapper::mapToBusinessDataAttributeCode)
            .toList());
  }

  private static BusinessDataAttribute mapToBusinessDataAttributeCode(DataAttribute dataAttribute) {
    return new BusinessDataAttribute(
        dataAttribute.getCode(),
        dataAttribute.getBaseAttributes().stream().map(BaseDataAttribute::getCode).toList());
  }
}
