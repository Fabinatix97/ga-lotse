/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import static de.eshg.lib.procedure.api.ProcedureApi.QueryParameter.PROCEDURE_TYPE;
import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_END;
import static de.eshg.lib.procedure.api.ProcedureMetricsApi.QueryParameter.TIME_RANGE_START;

import de.eshg.lib.procedure.model.GetTaskMetricsResponse;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface TaskMetricsApi {

  @GetExchange(BaseUrls.ProcedureLibrary.TASK_METRICS_API)
  @ApiResponse(responseCode = "200", description = "the metrics of a specific procedure type")
  @Operation(
      summary =
          "Get tasks metrics for a procedure type of a business module for procedures created in the given time range")
  GetTaskMetricsResponse getTaskMetrics(
      @RequestParam(name = PROCEDURE_TYPE) ProcedureTypeDto procedureType,
      @RequestParam(name = TIME_RANGE_START) Instant timeRangeStart,
      @RequestParam(name = TIME_RANGE_END) Instant timeRangeEnd);
}
