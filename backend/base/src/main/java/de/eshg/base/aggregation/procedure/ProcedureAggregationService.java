/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.procedure;

import static de.eshg.lib.aggregation.BusinessModuleAggregationHelper.aggregateErrorResponses;

import de.eshg.base.user.UserService;
import de.eshg.base.util.TimeRangeValidator;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.procedure.api.ProcedureMetricsApi;
import de.eshg.lib.procedure.model.*;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import org.springframework.stereotype.Service;

@Service
public class ProcedureAggregationService {

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final UserService userService;

  public ProcedureAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper, UserService userService) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.userService = userService;
  }

  GetAggregatedRecentProceduresResponse aggregateSelfRecentProcedures(
      Set<BusinessModule> filteringBusinessModules,
      Set<ProcedureTypeDto> filteringProcedureTypes,
      Set<ProcedureStatusDto> filteringProcedureStatus,
      Integer limit) {
    return aggregateRecentProcedures(
        filteringBusinessModules,
        limit,
        client ->
            client.getSelfRecentProcedures(
                filteringProcedureTypes, filteringProcedureStatus, limit));
  }

  GetAggregatedRecentProceduresResponse aggregateRecentProcedures(
      UUID userId,
      Set<BusinessModule> filteringBusinessModules,
      Set<ProcedureTypeDto> filteringProcedureTypes,
      Set<ProcedureStatusDto> filteringProcedureStatus,
      Integer limit) {
    return aggregateRecentProcedures(
        filteringBusinessModules,
        limit,
        client ->
            client.getRecentProcedures(
                userId, filteringProcedureTypes, filteringProcedureStatus, limit));
  }

  private GetAggregatedRecentProceduresResponse aggregateRecentProcedures(
      Set<BusinessModule> filteringBusinessModules,
      Integer limit,
      Function<BusinessModuleClient, GetRecentProceduresResponse> getRecentProceduresFunction) {
    List<ClientResponse<GetRecentProceduresResponse>> procedureResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            Optional.ofNullable(filteringBusinessModules)
                .orElseGet(userService::getSelfBusinessModules),
            BusinessModuleCapability.PROCEDURES,
            getRecentProceduresFunction);
    List<ProcedureDto> aggregatedProcedures = aggregateProcedures(procedureResponses, limit);
    List<ErrorResponseWithLocation> aggregatedErrorResponses =
        aggregateErrorResponses(procedureResponses);

    return new GetAggregatedRecentProceduresResponse(
        aggregatedProcedures, aggregatedErrorResponses);
  }

  private static List<ProcedureDto> aggregateProcedures(
      List<ClientResponse<GetRecentProceduresResponse>> businessModuleResponses, Integer limit) {
    return businessModuleResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .map(GetRecentProceduresResponse::procedures)
        .flatMap(Collection::stream)
        .sorted(Comparator.comparing(ProcedureDto::modifiedAt).reversed())
        .limit(limit)
        .toList();
  }

  GetAggregatedProcedureMetricsResponse aggregateProcedureMetrics(
      Instant timeRangeStart, Instant timeRangeEnd) {

    TimeRangeValidator.validateTimeRange(
        timeRangeStart, timeRangeEnd, ProcedureMetricsApi.MAXIMUM_DAYS_METRICS);

    List<ClientResponse<GetProcedureMetricsResponse>> extractedResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.PROCEDURE_AND_TASK_METRICS,
            client -> client.getProcedureMetrics(timeRangeStart, timeRangeEnd));

    Comparator<ProcedureMetric> moduleComparator =
        Comparator.comparing(metric -> metric.businessModule().name());
    Comparator<ProcedureMetric> procedureType =
        Comparator.comparing(metric -> metric.procedureType().name());

    List<ProcedureMetric> metrics =
        extractedResponses.stream()
            .map(ClientResponse::response)
            .filter(Objects::nonNull)
            .map(GetProcedureMetricsResponse::procedureMetrics)
            .flatMap(Collection::stream)
            .sorted(moduleComparator.thenComparing(procedureType))
            .toList();

    return new GetAggregatedProcedureMetricsResponse(
        metrics, aggregateErrorResponses(extractedResponses));
  }
}
