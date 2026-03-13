/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface UserFlowMetricsApi {

  String BASE_URL = "/user-flow-metrics";

  @GetExchange(BASE_URL)
  @ApiResponse(responseCode = "200", description = "Get user flow metrics for a time range")
  @Operation(summary = "Get user flow metrics for a time range")
  GetUserFlowMetricsResponse getUserFlowMetrics(
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd);
}
