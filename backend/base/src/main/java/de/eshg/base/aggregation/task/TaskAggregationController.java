/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOrderDto;
import de.eshg.lib.procedure.model.TaskStatusDto;
import de.eshg.lib.procedure.model.TaskTypeDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Base.TASK_API)
@Tag(name = "TaskAggregation")
public class TaskAggregationController {

  private final TaskAggregationService taskAggregationService;

  public TaskAggregationController(TaskAggregationService taskAggregationService) {
    this.taskAggregationService = taskAggregationService;
  }

  @GetMapping(path = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "the users tasks")
  @Operation(summary = "Get aggregated tasks for the dashboard")
  GetAggregatedTasksResponse aggregateTasksForDashboard() {
    return taskAggregationService.aggregateForDashboard();
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "the users tasks")
  @Operation(
      summary = "Get aggregated tasks",
      description =
          """
          ### GET operation for aggregated tasks
          assigneeId or assignedById is required as input parameter. However, they are mutually exclusive.
          """)
  GetAggregatedTasksResponse aggregateTasks(
      @RequestParam(name = "assigneeId", required = false)
          @Parameter(description = "Id of the assignee of the task")
          UUID assigneeId,
      @RequestParam(name = "assignedById", required = false)
          @Parameter(description = "Id of the user who assigned the task to someone")
          Set<UUID> assignedById,
      @RequestParam(name = "businessModule", required = false)
          @Parameter(description = "Filter on business module")
          Set<BusinessModule> businessModules,
      @RequestParam(name = "taskType", required = false)
          @Parameter(description = "Filter on task type")
          Set<TaskTypeDto> taskTypes,
      @RequestParam(name = "taskStatus", required = false)
          @Parameter(description = "Filter on task status")
          Set<TaskStatusDto> taskStatuses,
      @RequestParam(name = "sortBy", required = false, defaultValue = "PRIORITY")
          @Parameter(
              description =
                  """
                  The following sorting options are available:
                  - PRIORITY: First tasks with a dueDate are listed and sorted by DueDate. Afterwards tasks without a dueDate are listed and sorted by createdAt
                  - CREATED_AT: Sorting by createdAt attribute
                  - MODIFIED_AT: Sorting by modifiedAt attribute
                  """)
          GetTasksSortByDto sortBy,
      @RequestParam(name = "sortOrder", required = false, defaultValue = "ASC")
          @Parameter(
              description =
                  """
                  Sorting order. Possible options  "ASC" for ascending and "DESC" for descending
                  """)
          GetTasksSortOrderDto sortOrder,
      @RequestParam(name = "pageSize", required = false, defaultValue = "50")
          @Min(1)
          @Max(200)
          @Parameter(description = "Limit of returned tasks")
          Integer pageSize,
      @RequestParam(name = "pageNumber", required = false, defaultValue = "0")
          @Min(0)
          @Max(10)
          @Parameter(description = "Offset used for pagination")
          Integer pageNumber) {
    if (!eitherAssigneeIdOrAssignedByIdAreGiven(assigneeId, assignedById)) {
      throw new BadRequestException("One of 'assigneeId' and 'assignedById' must be given.");
    }
    return taskAggregationService.aggregate(
        new TaskAggregationSpecificationBuilder()
            .setAssigneeId(assigneeId)
            .setAssignedById(assignedById)
            .setBusinessModules(businessModules)
            .setTaskTypes(taskTypes)
            .setTaskStatus(taskStatuses)
            .setSortBy(sortBy)
            .setSortOrder(sortOrder)
            .setPageSize(pageSize)
            .setPageNumber(pageNumber)
            .createTaskAggregationSpecification());
  }

  private static boolean eitherAssigneeIdOrAssignedByIdAreGiven(
      UUID assigneeId, Set<UUID> assignedBy) {
    return (assignedBy != null && !assignedBy.isEmpty()) || assigneeId != null;
  }
}
