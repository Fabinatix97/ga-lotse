/*
 * Copyright 2024 cronn GmbH
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
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BaseDataSourceAttribute;
import de.eshg.statistics.api.datasource.BusinessDataSourceAttribute;
import de.eshg.statistics.api.datasource.GetAvailableDataSourcesResponse;
import de.eshg.statistics.config.OriginalDataAccessConfig;
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
  private final OriginalDataAccessConfig originalDataAccessConfig;

  public DataSourceAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseStatisticsApi baseModuleStatisticsApi,
      OriginalDataAccessConfig originalDataAccessConfig) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseModuleStatisticsApi = baseModuleStatisticsApi;
    this.originalDataAccessConfig = originalDataAccessConfig;
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources() {
    return getAvailableDataSources(null);
  }

  public GetAvailableDataSourcesResponse getAvailableDataSources(Set<String> businessModules) {
    List<ClientResponse<GetDataSourcesResponse>> extractedResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            businessModules, BusinessModuleClient::getAvailableDataSources);

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
                new AvailableDataSource(
                    businessModule,
                    originalDataAccessConfig.originalDataAllowedForCurrentUser(businessModule),
                    dataSource.id(),
                    dataSource.name(),
                    mapAndExtendAttributes(dataSource.attributes(), baseAvailableDataSources)))
        .toList();
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
                              mapToBaseDataSourceAttributes(availableDataSource.attributes()))
                      .orElse(null));
            })
        .toList();
  }

  private static List<BaseDataSourceAttribute> mapToBaseDataSourceAttributes(
      List<BaseAttribute> attributes) {
    return attributes.stream()
        .map(attribute -> new BaseDataSourceAttribute(attribute.name(), attribute.code()))
        .toList();
  }
}
