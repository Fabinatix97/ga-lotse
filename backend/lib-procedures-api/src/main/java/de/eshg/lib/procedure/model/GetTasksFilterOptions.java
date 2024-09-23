/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import static de.eshg.lib.procedure.model.TaskStatusDto.OPEN;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.lib.procedure.api.TaskListApi.QueryParameter;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.BindParam;

public record GetTasksFilterOptions(
    @BindParam(QueryParameter.ASSIGNEE_ID) UUID assigneeId,
    @BindParam(QueryParameter.ASSIGNED_BY_ID) Set<UUID> assignedById,
    @CanBeLogged @BindParam(QueryParameter.TASK_TYPE) Set<TaskTypeDto> taskTypes,
    @CanBeLogged @BindParam(QueryParameter.TASK_STATUS) Set<TaskStatusDto> taskStatus,
    @CanBeLogged @BindParam(QueryParameter.HAS_DUE_AT) Boolean hasDueAt,
    @CanBeLogged @BindParam(QueryParameter.IS_OVERDUE) Boolean isOverdue,
    @CanBeLogged @BindParam(QueryParameter.WAS_ASSIGNED_BY_OTHER) Boolean wasAssignedByOther) {

  public static GetTasksFilterOptions forDashboard(UUID assigneeId) {
    return new GetTasksFilterOptions(assigneeId, null, null, Set.of(OPEN), null, null, null);
  }
}
