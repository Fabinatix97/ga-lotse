/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.lib.aggregation.AggregationHelper.aggregateErrorResponses;

import de.eshg.base.statistics.BaseStatisticsApi;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseAvailableDataSource;
import de.eshg.base.statistics.api.SubjectType;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.DataSourceInfo;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BaseDataSourceAttribute;
import de.eshg.statistics.api.datasource.BusinessDataSourceAttribute;
import de.eshg.statistics.api.datasource.GetAvailableDataSourcesResponse;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.config.StatisticsConfig.BusinessModuleConfig;
import de.eshg.statistics.config.StatisticsFeature;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import de.eshg.statistics.mapper.EvaluationMapper;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class DataSourceAggregationService {

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final BaseStatisticsApi baseModuleStatisticsApi;
  private final BusinessModuleConfig businessModuleConfig;
  private final StatisticsFeatureToggle statisticsFeatureToggle;

  public DataSourceAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseStatisticsApi baseModuleStatisticsApi,
      StatisticsConfig statisticsConfig,
      StatisticsFeatureToggle statisticsFeatureToggle) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseModuleStatisticsApi = baseModuleStatisticsApi;
    this.businessModuleConfig = statisticsConfig.businessModule();
    this.statisticsFeatureToggle = statisticsFeatureToggle;
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources() {
    return getAvailableDataSources(null, false);
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources(
      Set<String> businessModules, boolean onlyUsableByCurrentUser) {
    List<ClientResponse<GetDataSourcesResponse>> extractedResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            businessModules, null, BusinessModuleClient::getAvailableDataSources);

    List<BaseAvailableDataSource> baseAvailableDataSources =
        baseModuleStatisticsApi.getAvailableDataSources().baseAvailableDataSources();

    List<AvailableDataSource> availableDataSources =
        getAvailableDataSources(extractedResponses, baseAvailableDataSources);

    if (onlyUsableByCurrentUser) {
      List<AvailableDataSource> dataSourcesUsableByCurrentUser =
          availableDataSources.stream()
              .filter(
                  availableDataSource ->
                      !availableDataSource.sensitivity().equals(DataSourceSensitivity.SENSITIVE)
                          || availableDataSource.sensitiveDataAllowed()
                          || availableDataSource.canBeAnonymized())
              .toList();
      return new GetAvailableDataSourcesResponse(
          dataSourcesUsableByCurrentUser, aggregateErrorResponses(extractedResponses));
    } else {
      return new GetAvailableDataSourcesResponse(
          availableDataSources, aggregateErrorResponses(extractedResponses));
    }
  }

  private List<AvailableDataSource> getAvailableDataSources(
      List<ClientResponse<GetDataSourcesResponse>> businessModuleResponses,
      List<BaseAvailableDataSource> baseAvailableDataSources) {
    return businessModuleResponses.stream()
        .filter(clientResponse -> clientResponse.response() != null)
        .map(
            clientResponse ->
                mapToAvailableDataSources(
                    clientResponse.response(),
                    clientResponse.businessModule().name(),
                    baseAvailableDataSources))
        .flatMap(Collection::stream)
        .sorted(
            Comparator.comparing(AvailableDataSource::businessModuleName)
                .thenComparing(AvailableDataSource::name))
        .toList();
  }

  private List<AvailableDataSource> mapToAvailableDataSources(
      GetDataSourcesResponse response,
      String businessModule,
      List<BaseAvailableDataSource> baseAvailableDataSources) {
    return response.dataSources().stream()
        .map(
            dataSource ->
                mapToAvailableDataSource(businessModule, dataSource, baseAvailableDataSources))
        .toList();
  }

  private AvailableDataSource mapToAvailableDataSource(
      String businessModule,
      DataSourceInfo dataSource,
      List<BaseAvailableDataSource> baseAvailableDataSources) {
    return new AvailableDataSource(
        businessModule,
        isSensitiveDataAllowed(
            dataSource.sensitivity(),
            businessModuleConfig.sensitiveDataAllowedForCurrentUser(businessModule)),
        dataSource.id(),
        dataSource.name(),
        dataSource.sensitivity(),
        canBeAnonymized(dataSource),
        mapAndExtendAttributes(dataSource.attributes(), baseAvailableDataSources));
  }

  private boolean canBeAnonymized(DataSourceInfo dataSource) {
    return statisticsFeatureToggle.isNewFeatureEnabled(StatisticsFeature.ANONYMIZATION)
        && !DataSourceSensitivity.ANONYMOUS.equals(dataSource.sensitivity())
        && dataSource.kAnonymity() != null
        && noDataPrivacyCategoryMissing(dataSource)
        && noIntervalConfigMissing(dataSource)
        && noSensitiveConfigMissing(dataSource);
  }

  private static boolean noDataPrivacyCategoryMissing(DataSourceInfo dataSource) {
    return dataSource.attributes().stream()
        .noneMatch(
            attribute ->
                attribute.dataPrivacyCategory() == null && !isBaseModuleId(attribute.valueType()));
  }

  private static boolean noIntervalConfigMissing(DataSourceInfo dataSource) {
    return dataSource.attributes().stream()
        .noneMatch(
            attribute ->
                DataPrivacyCategory.QUASI_IDENTIFYING.equals(attribute.dataPrivacyCategory())
                    && (attribute.valueType().equals(ValueType.INTEGER)
                        || attribute.valueType().equals(ValueType.DECIMAL))
                    && attribute.intervalConfiguration() == null);
  }

  private static boolean noSensitiveConfigMissing(DataSourceInfo dataSource) {
    return dataSource.attributes().stream()
        .noneMatch(
            attribute ->
                DataPrivacyCategory.SENSITIVE.equals(attribute.dataPrivacyCategory())
                    && attribute.lDiversity() == null
                    && attribute.tCloseness() == null);
  }

  public static boolean isSensitiveDataAllowed(
      DataSourceSensitivity sensitivity, boolean sensitiveDataAllowedForBusinessModule) {
    return DataSourceSensitivity.SENSITIVE.equals(sensitivity)
        && sensitiveDataAllowedForBusinessModule;
  }

  private static List<BusinessDataSourceAttribute> mapAndExtendAttributes(
      List<Attribute> businessAttributes, List<BaseAvailableDataSource> baseAvailableDataSources) {
    return businessAttributes.stream()
        .map(
            attribute -> {
              List<BaseDataSourceAttribute> baseDataSourceAttributes =
                  findBaseAvailableDataSource(baseAvailableDataSources, attribute)
                      .map(
                          availableDataSource ->
                              mapToBaseDataSourceAttributes(
                                  attribute.name(), availableDataSource.attributes()))
                      .orElse(null);
              return new BusinessDataSourceAttribute(
                  attribute.name(),
                  attribute.code(),
                  attribute.category(),
                  baseDataSourceAttributes == null ? attribute.dataPrivacyCategory() : null,
                  baseDataSourceAttributes);
            })
        .toList();
  }

  private static Optional<BaseAvailableDataSource> findBaseAvailableDataSource(
      List<BaseAvailableDataSource> baseAvailableDataSources, Attribute attribute) {
    if (!isBaseModuleId(attribute.valueType())) {
      return Optional.empty();
    } else {
      return baseAvailableDataSources.stream()
          .filter(
              baseDataSource ->
                  baseDataSource.subjectType().equals(mapToSubjectType(attribute.valueType())))
          .findFirst();
    }
  }

  static boolean isBaseModuleId(ValueType valueType) {
    return valueType.equals(ValueType.CENTRAL_FILE_ID_PERSON)
        || valueType.equals(ValueType.CENTRAL_FILE_ID_FACILITY)
        || valueType.equals(ValueType.CONTACT_ID);
  }

  static SubjectType mapToSubjectType(ValueType valueType) {
    return switch (valueType) {
      case ValueType.CENTRAL_FILE_ID_FACILITY -> SubjectType.FACILITY;
      case ValueType.CENTRAL_FILE_ID_PERSON -> SubjectType.PERSON;
      case ValueType.CONTACT_ID -> SubjectType.CONTACT;
      default -> throw new IllegalStateException("Unexpected value: " + valueType);
    };
  }

  private static List<BaseDataSourceAttribute> mapToBaseDataSourceAttributes(
      String businessAttributeName, List<BaseAttribute> attributes) {
    return attributes.stream()
        .map(
            attribute ->
                new BaseDataSourceAttribute(
                    EvaluationMapper.getAttributeDisplayName(
                        businessAttributeName, attribute.name()),
                    attribute.name(),
                    attribute.code(),
                    attribute.dataPrivacyCategory()))
        .toList();
  }
}
