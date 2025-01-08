/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.base.statistics.api.GetBaseDataSourcesResponse;
import de.eshg.base.statistics.api.GetBaseStatisticsDataRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataResponse;
import de.eshg.lib.statistics.StatisticsApi;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(StatisticsApi.BASE_URL)
public interface BaseStatisticsApi {

  @GetExchange("/data-source")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the available data sources with the corresponding attributes")
  @Operation(summary = "Get available data sources")
  GetBaseDataSourcesResponse getAvailableDataSources();

  @PostExchange("/specific-data")
  @Operation(summary = "Get specific data for the requested attributes")
  GetBaseStatisticsDataResponse getSpecificData(
      @Valid @RequestBody GetBaseStatisticsDataRequest getSpecificDataRequest);
}
