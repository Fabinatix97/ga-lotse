/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.datasource.GetAvailableDataSourcesResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(value = DataSourceController.BASE_URL)
@Tag(name = "DataSource")
public class DataSourceController {

  static final String BASE_URL = BaseUrls.Statistics.DATA_SOURCE_CONTROLLER;

  private final DataSourceAggregationService dataSourceAggregationService;

  public DataSourceController(DataSourceAggregationService dataSourceAggregationService) {
    this.dataSourceAggregationService = dataSourceAggregationService;
  }

  @GetExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The aggregated available data sources")
  @Operation(summary = "Get available data sources")
  GetAvailableDataSourcesResponse getAvailableDataSources() {
    return dataSourceAggregationService.getAvailableDataSources();
  }
}
