/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.lib.aggregation.AggregationHelper.aggregateErrorResponses;

import de.eshg.base.statistics.BaseStatisticsApi;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseAvailableDataSource;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataSource;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BaseDataSourceAttribute;
import de.eshg.statistics.api.datasource.BusinessDataSourceAttribute;
import de.eshg.statistics.api.datasource.GetAvailableDataSourcesResponse;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.config.StatisticsConfig.BusinessModuleConfig;
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

  public DataSourceAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseStatisticsApi baseModuleStatisticsApi,
      StatisticsConfig statisticsConfig) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseModuleStatisticsApi = baseModuleStatisticsApi;
    this.businessModuleConfig = statisticsConfig.businessModule();
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources() {
    return getAvailableDataSources(null);
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources(Set<String> businessModules) {
    List<ClientResponse<GetDataSourcesResponse>> extractedResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            businessModules, null, BusinessModuleClient::getAvailableDataSources);

    List<BaseAvailableDataSource> baseAvailableDataSources =
        baseModuleStatisticsApi.getAvailableDataSources().baseAvailableDataSources();

    List<AvailableDataSource> availableDataSources =
        extractedResponses.stream()
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

    return new GetAvailableDataSourcesResponse(
        availableDataSources, aggregateErrorResponses(extractedResponses));
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
      DataSource dataSource,
      List<BaseAvailableDataSource> baseAvailableDataSources) {
    return new AvailableDataSource(
        businessModule,
        isSensitiveDataAllowed(
            dataSource.sensitivity(),
            businessModuleConfig.sensitiveDataAllowedForCurrentUser(businessModule)),
        dataSource.id(),
        dataSource.name(),
        dataSource.sensitivity(),
        dataSource.canBeAnonymized(),
        mapAndExtendAttributes(dataSource.attributes(), baseAvailableDataSources));
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
              Optional<BaseAvailableDataSource> baseAvailableDataSource =
                  baseAvailableDataSources.stream()
                      .filter(
                          baseDataSource ->
                              baseDataSource.subjectType().equals(attribute.subjectType()))
                      .findFirst();
              return new BusinessDataSourceAttribute(
                  attribute.name(),
                  attribute.code(),
                  attribute.category(),
                  baseAvailableDataSource
                      .map(
                          availableDataSource ->
                              mapToBaseDataSourceAttributes(
                                  attribute.name(), availableDataSource.attributes()))
                      .orElse(null));
            })
        .toList();
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
                    attribute.code()))
        .toList();
  }
}
