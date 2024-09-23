/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.lib.statistics.api.DataSource;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.util.DataSourceInfo;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnBean(AbstractStatisticsService.class)
@Hidden
public class StatisticsController implements StatisticsApi {
  private final AbstractStatisticsService<?> statisticsService;

  public StatisticsController(AbstractStatisticsService<?> statisticsService) {
    this.statisticsService = statisticsService;
  }

  @Override
  @Transactional(readOnly = true)
  public GetDataSourcesResponse getAvailableDataSources() {
    List<DataSourceInfo> dataSourceInfos = statisticsService.getDataSourceMetaInfos();
    return new GetDataSourcesResponse(
        dataSourceInfos.stream()
            .map(
                dataSourceInfo ->
                    new DataSource(
                        dataSourceInfo.id(),
                        dataSourceInfo.name(),
                        statisticsService.getAttributes(dataSourceInfo.id())))
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    return statisticsService.getSpecificData(getSpecificDataRequest);
  }
}
