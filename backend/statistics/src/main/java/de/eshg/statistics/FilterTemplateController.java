/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import static de.eshg.statistics.FilterTemplateController.BASE_URL;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.aggregation.StatisticService;
import de.eshg.statistics.api.filtertemplate.AddFilterTemplateRequest;
import de.eshg.statistics.api.filtertemplate.FilterTemplateDto;
import de.eshg.statistics.api.filtertemplate.GetFilterTemplatesForStatisticResponse;
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
@Tag(name = "FilterTemplate")
@HttpExchange(BASE_URL)
public class FilterTemplateController {
  public static final String BASE_URL = BaseUrls.Statistics.FILTER_TEMPLATE_CONTROLLER;

  private final FilterTemplateService filterTemplateService;
  private final StatisticService statisticService;

  public FilterTemplateController(
      FilterTemplateService filterTemplateService, StatisticService statisticService) {
    this.filterTemplateService = filterTemplateService;
    this.statisticService = statisticService;
  }

  @PostExchange(accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The UUID of the filter template")
  @Operation(summary = "Add filter template")
  public UUID addFilterTemplate(
      @Valid @RequestBody AddFilterTemplateRequest addFilterTemplateRequest) {
    return filterTemplateService.addFilterTemplate(addFilterTemplateRequest);
  }

  @GetExchange(value = "/{filterTemplateId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "The information for the detail page")
  @Operation(summary = "Get the information for the detail page")
  public FilterTemplateDto getFilterTemplate(
      @PathVariable(name = "filterTemplateId") UUID filterTemplateId) {
    return filterTemplateService.getFilterTemplate(filterTemplateId);
  }

  @GetExchange(value = "/statistic/{statisticId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Fitting filter templates for a statistic")
  @Operation(summary = "Get filter templates that can be used on the statistic")
  public GetFilterTemplatesForStatisticResponse findFilterTemplatesForStatistic(
      @PathVariable(name = "statisticId") UUID statisticId) {
    statisticService.checkPermissionForStatistic(statisticId);
    return filterTemplateService.findFilterTemplatesForStatistic(statisticId);
  }

  @DeleteExchange(value = "/{filterTemplateId}", accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returned when the filter template is deleted")
  @Operation(summary = "Delete a filter template")
  public void deleteFilterTemplate(@PathVariable(name = "filterTemplateId") UUID filterTemplateId) {
    filterTemplateService.deleteFilterTemplate(filterTemplateId);
  }
}
