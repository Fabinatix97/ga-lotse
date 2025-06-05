/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.procedure;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import java.util.Set;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface ProcedureAggregationApi {

  @GetExchange(value = Base.SELF_RECENT_PROCEDURES_API, accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "the users recent procedures")
  @Operation(summary = "Get recent procedures for the current user")
  GetAggregatedRecentProceduresResponse aggregateSelfRecentProcedures(
      @RequestParam(name = "businessModule", required = false)
          Set<BusinessModule> filteringBusinessModules,
      @RequestParam(name = "procedureType", required = false)
          Set<ProcedureTypeDto> filteringProcedureTypes,
      @RequestParam(name = "procedureStatus", required = false)
          Set<ProcedureStatusDto> filteringProcedureStatus,
      @RequestParam(name = "limit", required = false, defaultValue = "50") @Min(1) @Max(200)
          Integer limit);

  @GetExchange(value = Base.PROCEDURE_METRICS_API, accept = APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "the metrics of procedures")
  @Operation(summary = "Get procedure metrics for procedures created in the given time range")
  GetAggregatedProcedureMetricsResponse aggregateProcedureMetrics(
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd);
}
