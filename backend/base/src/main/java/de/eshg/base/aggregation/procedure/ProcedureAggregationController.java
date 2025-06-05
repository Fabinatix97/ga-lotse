/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.procedure;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.Set;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "ProcedureAggregation")
public class ProcedureAggregationController implements ProcedureAggregationApi {

  private final ProcedureAggregationService procedureAggregationService;

  public ProcedureAggregationController(ProcedureAggregationService procedureAggregationService) {
    this.procedureAggregationService = procedureAggregationService;
  }

  @Override
  public GetAggregatedRecentProceduresResponse aggregateSelfRecentProcedures(
      Set<BusinessModule> filteringBusinessModules,
      Set<ProcedureTypeDto> filteringProcedureTypes,
      Set<ProcedureStatusDto> filteringProcedureStatus,
      Integer limit) {
    return procedureAggregationService.aggregateSelfRecentProcedures(
        filteringBusinessModules, filteringProcedureTypes, filteringProcedureStatus, limit);
  }

  @Override
  public GetAggregatedProcedureMetricsResponse aggregateProcedureMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return procedureAggregationService.aggregateProcedureMetrics(timeRangeStart, timeRangeEnd);
  }
}
