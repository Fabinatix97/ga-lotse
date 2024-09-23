/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_TYPE;
import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_END;
import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_START;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.util.TimeRangeValidator;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.procedure.api.ProcedureMetricsApi;
import de.eshg.lib.procedure.model.GetTaskMetricsResponse;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.Base.TASK_METRICS_API)
@Tag(name = "TaskMetrics")
public class TaskMetricsController {
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final BaseFeatureToggle baseFeatureToggle;

  public TaskMetricsController(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      BaseFeatureToggle baseFeatureToggle) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.baseFeatureToggle = baseFeatureToggle;
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "the metrics of a specific procedure type")
  @Operation(
      summary =
          "Get task metrics for a procedure type of a business module for procedures created in the given time range")
  GetTaskMetricsResponse getTaskMetrics(
      @RequestParam(name = PROCEDURE_TYPE) ProcedureTypeDto procedureType,
      @RequestParam(name = TIME_RANGE_START) Instant timeRangeStart,
      @RequestParam(name = TIME_RANGE_END) Instant timeRangeEnd,
      @RequestParam(name = "businessModuleName") String businessModuleName) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.TASK_METRICS);

    businessModuleAggregationHelper.validateBusinessModuleIsRegistered(businessModuleName);
    TimeRangeValidator.validateTimeRange(
        timeRangeStart, timeRangeEnd, ProcedureMetricsApi.MAXIMUM_DAYS_METRICS);

    List<ClientResponse<GetTaskMetricsResponse>> clientResponses =
        businessModuleAggregationHelper.requestFromBusinessModulesClients(
            Set.of(businessModuleName),
            client -> client.getTaskMetrics(procedureType, timeRangeStart, timeRangeEnd));
    if (clientResponses.isEmpty() || clientResponses.getFirst().response() == null) {
      throw new IllegalStateException("Could not retrieve data from business module");
    } else {
      return clientResponses.getFirst().response();
    }
  }
}
