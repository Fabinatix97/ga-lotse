/*
 * Copyright 2026 cronn GmbH
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
import de.eshg.lib.userflowmetrics.api.GetUserFlowMetricsResponse;
import de.eshg.lib.userflowmetrics.api.UserFlowMetric;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;
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

    List<ClientResponse<GetProcedureMetricsResponse>> procedureMetricsResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.PROCEDURE_AND_TASK_METRICS,
            client -> client.getProcedureMetrics(timeRangeStart, timeRangeEnd));
    List<ClientResponse<GetUserFlowMetricsResponse>> userFlowResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.USER_FLOW_METRICS,
            client -> client.getUserFlowMetrics(timeRangeStart, timeRangeEnd));

    List<ProcedureMetric> procedureMetrics = getProcedureMetrics(procedureMetricsResponses);
    List<ProcedureActionMetric> procedureActionMetrics =
        getProcedureActionMetrics(procedureMetricsResponses);
    List<UserFlowMetric> userFlowMetrics = getGetUserFlowMetrics(userFlowResponses);

    List<ErrorResponseWithLocation> errorResponses =
        Stream.concat(
                aggregateErrorResponses(procedureMetricsResponses).stream(),
                aggregateErrorResponses(userFlowResponses).stream())
            .toList();

    return new GetAggregatedProcedureMetricsResponse(
        procedureMetrics, procedureActionMetrics, userFlowMetrics, errorResponses);
  }

  private static List<ProcedureMetric> getProcedureMetrics(
      List<ClientResponse<GetProcedureMetricsResponse>> procedureMetricsResponses) {
    Comparator<ProcedureMetric> moduleComparator =
        Comparator.comparing(metric -> metric.businessModule().name());
    Comparator<ProcedureMetric> procedureType =
        Comparator.comparing(metric -> metric.procedureType().name());

    return procedureMetricsResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .map(GetProcedureMetricsResponse::procedureMetrics)
        .flatMap(Collection::stream)
        .sorted(moduleComparator.thenComparing(procedureType))
        .toList();
  }

  private static List<ProcedureActionMetric> getProcedureActionMetrics(
      List<ClientResponse<GetProcedureMetricsResponse>> procedureMetricsResponses) {
    return procedureMetricsResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .map(GetProcedureMetricsResponse::procedureActionMetric)
        .filter(Objects::nonNull)
        .sorted(Comparator.comparing(metric -> metric.businessModule().name()))
        .toList();
  }

  private static List<UserFlowMetric> getGetUserFlowMetrics(
      List<ClientResponse<GetUserFlowMetricsResponse>> userFlowResponses) {
    Comparator<UserFlowMetric> moduleComparator =
        Comparator.comparing(metric -> metric.businessModule().name());
    Comparator<UserFlowMetric> flowTypeComparator =
        Comparator.comparing(metric -> metric.userFlowType().name());

    return userFlowResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .map(GetUserFlowMetricsResponse::userFlowMetrics)
        .flatMap(Collection::stream)
        .sorted(moduleComparator.thenComparing(flowTypeComparator))
        .toList();
  }
}
