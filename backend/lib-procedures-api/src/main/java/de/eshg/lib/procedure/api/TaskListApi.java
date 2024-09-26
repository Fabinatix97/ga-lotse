/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.procedure.model.GetTasksFilterOptions;
import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOptions;
import de.eshg.lib.procedure.model.TaskResponse;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface TaskListApi {

  GetTasksSortByDto DASHBOARD_SORT_BY = GetTasksSortByDto.PRIORITY;
  int DASHBOARD_LIMIT = 10;

  class QueryParameter {
    private QueryParameter() {}

    public static final String WAS_ASSIGNED_BY_OTHER = "wasAssignedByOther";
    public static final String IS_OVERDUE = "isOverdue";
    public static final String ASSIGNEE_ID = "assigneeId";
    public static final String ASSIGNED_BY_ID = "assignedById";
    public static final String TASK_TYPE = "taskTypes";
    public static final String TASK_STATUS = "taskStatus";
    public static final String HAS_DUE_AT = "hasDueAt";
    public static final String SORT_KEY = "sortKey";
    public static final String SORT_ORDER = "sortOrder";
    public static final String LIMIT = "limit";
  }

  @GetExchange(ProcedureLibrary.TASKS_API + "/dashboard")
  @ApiResponse(responseCode = "200", description = "tasks")
  @Operation(summary = "Get tasks for the dashboard")
  TaskResponse getTasksForDashboard();

  @GetExchange(ProcedureLibrary.TASKS_API)
  @ApiResponse(responseCode = "200", description = "tasks")
  @Operation(summary = "Get tasks")
  TaskResponse getTasks(
      @InlineParameterObject @ParameterObject @Valid GetTasksFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid GetTasksSortOptions sortOptions,
      @RequestParam(name = QueryParameter.LIMIT, required = false, defaultValue = "50")
          @Min(1)
          @Max(200)
          Integer limit);
}
