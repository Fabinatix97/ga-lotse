/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics;

import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetDataTableHeaderRequest;
import de.eshg.lib.statistics.api.GetDataTableHeaderResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(StatisticsApi.BASE_URL)
public interface StatisticsApi {
  String BASE_URL = BaseUrls.STATISTICS;

  @GetExchange("/data-source")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the available data sources with the corresponding attributes")
  @Operation(summary = "Get available data sources")
  GetDataSourcesResponse getAvailableDataSources();

  @PostExchange("/data-table-header")
  @Operation(summary = "Get data table header for the requested attributes")
  GetDataTableHeaderResponse getDataTableHeader(
      @Valid @RequestBody GetDataTableHeaderRequest getDataTableHeaderRequest);

  @PostExchange("/specific-data")
  @Operation(summary = "Get specific data for the requested attributes")
  GetSpecificDataResponse getSpecificData(
      @Valid @RequestBody GetSpecificDataRequest getSpecificDataRequest);
}
