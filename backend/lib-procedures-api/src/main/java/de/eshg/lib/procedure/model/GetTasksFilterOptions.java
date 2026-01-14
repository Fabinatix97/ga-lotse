/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.model.TaskStatusDto.OPEN;

import de.eshg.lib.procedure.api.TaskListApi.QueryParameter;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.BindParam;

public record GetTasksFilterOptions(
    @BindParam(QueryParameter.ASSIGNEE_ID) UUID assigneeId,
    @BindParam(QueryParameter.ASSIGNED_BY_ID) Set<UUID> assignedById,
    @BindParam(QueryParameter.TASK_TYPE) Set<TaskTypeDto> taskTypes,
    @BindParam(QueryParameter.TASK_STATUS) Set<TaskStatusDto> taskStatus) {

  public static GetTasksFilterOptions forDashboard(UUID assigneeId) {
    return new GetTasksFilterOptions(assigneeId, null, null, Set.of(OPEN));
  }
}
