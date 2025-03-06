/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.lib.statistics.api.DataSourceInfo;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetDataTableHeaderRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.datasource.DataSource;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Hidden
public class StatisticsController implements StatisticsApi {
  private final StatisticsService statisticsService;

  public StatisticsController(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  @Override
  @Transactional(readOnly = true)
  public GetDataSourcesResponse getAvailableDataSources() {
    List<DataSource<?>> dataSources = statisticsService.getDataSources();
    return new GetDataSourcesResponse(
        dataSources.stream()
            .map(
                dataSource ->
                    new DataSourceInfo(
                        dataSource.getId(),
                        dataSource.getName(),
                        dataSource.getSensitivity(),
                        statisticsService.getAttributes(dataSource)))
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetDataTableHeaderResponse getDataTableHeader(
      GetDataTableHeaderRequest getDataTableHeaderRequest) {
    return statisticsService.getDataTableHeader(getDataTableHeaderRequest);
  }

  @Override
  @Transactional
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    return statisticsService.getSpecificData(getSpecificDataRequest);
  }
}
