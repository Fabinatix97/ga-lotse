/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_END;
import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_START;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.lib.procedure.model.GetProcedureMetricsResponse;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface ProcedureMetricsApi {

  int MAXIMUM_DAYS_METRICS = 366;

  class QueryParameter {

    public static final String TIME_RANGE_START = "timeRangeStart";
    public static final String TIME_RANGE_END = "timeRangeEnd";

    private QueryParameter() {}
  }

  @GetExchange(ProcedureLibrary.PROCEDURE_METRICS_API)
  @ApiResponse(responseCode = "200", description = "the metrics of procedures")
  @Operation(summary = "Get procedure metrics for procedures created in the given time range")
  GetProcedureMetricsResponse getProcedureMetrics(
      @CanBeLogged @RequestParam(name = TIME_RANGE_START) Instant timeRangeStart,
      @CanBeLogged @RequestParam(name = TIME_RANGE_END) Instant timeRangeEnd);
}
