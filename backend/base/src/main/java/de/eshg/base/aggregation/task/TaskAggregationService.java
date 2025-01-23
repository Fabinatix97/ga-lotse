/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import static de.eshg.lib.aggregation.BusinessModuleAggregationHelper.aggregateErrorResponses;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.procedure.api.TaskListApi;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.GetTasksSortOrderDto;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;

@Service
public class TaskAggregationService {

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final UserService userService;

  public TaskAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper, UserService userService) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.userService = userService;
  }

  public GetAggregatedTasksResponse aggregate(TaskAggregationSpecification tas) {
    List<ClientResponse<TaskResponse>> taskResponses = requestTasksFromBusinessModules(tas);

    long aggregatedCount = aggregateCount(taskResponses);

    if (tas.offset() > aggregatedCount) {
      throw new BadRequestException(
          ErrorCode.AGGREGATION_EXCEPTION,
          "Could not aggregate tasks, offset is larger than amount of tasks.");
    }

    List<TaskDto> aggregatedTasks = aggregateTasks(taskResponses, tas);
    List<ErrorResponseWithLocation> aggregatedResponseErrors =
        aggregateErrorResponses(taskResponses);

    return new GetAggregatedTasksResponse(
        aggregatedCount, aggregatedTasks, resolveUsers(aggregatedTasks), aggregatedResponseErrors);
  }

  public GetAggregatedTasksResponse aggregateForDashboard() {
    List<ClientResponse<TaskResponse>> businessModuleResponses =
        requestTasksFromBusinessModulesForDashboard();

    long count = aggregateCount(businessModuleResponses);
    List<TaskDto> tasks =
        aggregateTasks(
            businessModuleResponses,
            TaskListApi.DASHBOARD_SORT_BY,
            null,
            0,
            TaskListApi.DASHBOARD_LIMIT);
    List<ErrorResponseWithLocation> responseErrors =
        aggregateErrorResponses(businessModuleResponses);

    return new GetAggregatedTasksResponse(count, tasks, resolveUsers(tasks), responseErrors);
  }

  private Map<UUID, UserDto> resolveUsers(List<TaskDto> aggregatedTasks) {
    return userService
        .getUsers(
            aggregatedTasks.stream()
                .map(TaskDto::getResolvableUserIds)
                .flatMap(Collection::stream)
                .distinct()
                .toList(),
            false)
        .stream()
        .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
  }

  private static List<TaskDto> aggregateTasks(
      List<ClientResponse<TaskResponse>> responses, TaskAggregationSpecification tas) {
    return aggregateTasks(responses, tas.sortBy(), tas.sortOrder(), tas.offset(), tas.limit());
  }

  private static List<TaskDto> aggregateTasks(
      List<ClientResponse<TaskResponse>> businessModuleResponses,
      GetTasksSortByDto sortBy,
      GetTasksSortOrderDto sortOrder,
      int offset,
      int limit) {
    return businessModuleResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .map(TaskResponse::tasks)
        .flatMap(Collection::stream)
        .sorted(TaskSortHelper.getComparator(sortBy, sortOrder))
        .skip(offset)
        .limit(limit)
        .toList();
  }

  private static long aggregateCount(List<ClientResponse<TaskResponse>> businessModuleResponses) {
    return businessModuleResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .mapToLong(TaskResponse::count)
        .sum();
  }

  private List<ClientResponse<TaskResponse>> requestTasksFromBusinessModules(
      TaskAggregationSpecification tas) {
    return requestTasksFromBusinessModules(
        tas.businessModules(),
        client ->
            client.getTasks(
                new GetTasksFilterOptions(
                    tas.assigneeId(), tas.assignedById(), tas.taskTypes(), tas.taskStatuses()),
                new GetTasksSortOptions(tas.sortBy(), tas.sortOrder()),
                tas.limit() + tas.offset()));
  }

  private List<ClientResponse<TaskResponse>> requestTasksFromBusinessModulesForDashboard() {
    return requestTasksFromBusinessModules(null, TaskListApi::getTasksForDashboard);
  }

  private List<ClientResponse<TaskResponse>> requestTasksFromBusinessModules(
      Set<BusinessModule> businessModules, Function<BusinessModuleClient, TaskResponse> getTasks) {
    return businessModuleAggregationHelper.requestFromBusinessModules(
        Optional.ofNullable(businessModules).orElseGet(userService::getSelfBusinessModules),
        BusinessModuleCapability.TASKS,
        getTasks);
  }
}
