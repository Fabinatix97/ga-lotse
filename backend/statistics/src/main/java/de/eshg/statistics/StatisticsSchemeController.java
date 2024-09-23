/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import static de.eshg.statistics.StatisticsSchemeController.BASE_URL;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.AddStatisticsSchemeRequest;
import de.eshg.statistics.api.GetStatisticsSchemesResponse;
import de.eshg.statistics.api.StatisticsSchemeDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@HttpExchange(value = BASE_URL)
@Tag(name = "StatisticsScheme")
public class StatisticsSchemeController {
  public static final String BASE_URL = BaseUrls.Statistics.STATISTICS_SCHEME_CONTROLLER;

  private final StatisticsSchemeService statisticsSchemeService;
  private final DataSourceValidator dataSourceValidator;

  public StatisticsSchemeController(
      StatisticsSchemeService statisticsSchemeService, DataSourceValidator dataSourceValidator) {
    this.statisticsSchemeService = statisticsSchemeService;
    this.dataSourceValidator = dataSourceValidator;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The added statistics scheme")
  @Operation(summary = "Add a statistics scheme")
  public StatisticsSchemeDto addStatisticsScheme(
      @Valid @RequestBody AddStatisticsSchemeRequest addStatisticsSchemeRequest) {
    dataSourceValidator.validateDataSources(addStatisticsSchemeRequest.dataSources());
    return statisticsSchemeService.addStatisticsScheme(addStatisticsSchemeRequest);
  }

  @GetExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "All statistics schemes")
  @Operation(summary = "Get all statistics schemes")
  public GetStatisticsSchemesResponse getStatisticsSchemes() {
    return new GetStatisticsSchemesResponse(statisticsSchemeService.getAllStatisticsSchemes());
  }

  @GetExchange(value = "/{schemeId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The statistics scheme")
  @Operation(summary = "Get a statistics scheme")
  public StatisticsSchemeDto getStatisticsScheme(@PathVariable(name = "schemeId") UUID schemeId) {
    return statisticsSchemeService.getStatisticsScheme(schemeId);
  }

  @DeleteExchange(value = "/{schemeId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the statistics scheme is deleted")
  @Operation(summary = "Delete a statistics scheme")
  public void deleteStatisticsScheme(@PathVariable(name = "schemeId") UUID schemeId) {
    statisticsSchemeService.deleteStatisticsScheme(schemeId);
  }
}
