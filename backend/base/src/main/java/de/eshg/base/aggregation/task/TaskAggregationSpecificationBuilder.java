/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.GetTasksSortByDto;
import de.eshg.lib.procedure.model.GetTasksSortOrderDto;
import de.eshg.lib.procedure.model.TaskStatusDto;
import de.eshg.lib.procedure.model.TaskTypeDto;
import java.util.Set;
import java.util.UUID;

public class TaskAggregationSpecificationBuilder {

  private UUID assigneeId;
  private Set<UUID> assignedById;
  private Set<BusinessModule> businessModules;
  private Set<TaskTypeDto> taskTypes;
  private Set<TaskStatusDto> taskStatuses;
  private Boolean hasDueAt;
  private Boolean isOverdue;
  private Boolean wasAssignedByOther;
  private GetTasksSortByDto sortBy = GetTasksSortByDto.PRIORITY;
  private GetTasksSortOrderDto sortOrder = GetTasksSortOrderDto.ASC;
  private Integer limit = 50;
  private Integer offset = 0;

  public TaskAggregationSpecificationBuilder setAssigneeId(UUID assigneeId) {
    this.assigneeId = assigneeId;
    return this;
  }

  public TaskAggregationSpecificationBuilder setAssignedById(Set<UUID> assignedById) {
    this.assignedById = assignedById;
    return this;
  }

  public TaskAggregationSpecificationBuilder setBusinessModules(
      Set<BusinessModule> businessModules) {
    this.businessModules = businessModules;
    return this;
  }

  public TaskAggregationSpecificationBuilder setTaskTypes(Set<TaskTypeDto> taskTypes) {
    this.taskTypes = taskTypes;
    return this;
  }

  public TaskAggregationSpecificationBuilder setTaskStatus(Set<TaskStatusDto> taskStatuses) {
    this.taskStatuses = taskStatuses;
    return this;
  }

  public TaskAggregationSpecificationBuilder setHasDueAt(Boolean hasDueAt) {
    this.hasDueAt = hasDueAt;
    return this;
  }

  public TaskAggregationSpecificationBuilder setIsOverdue(Boolean isOverdue) {
    this.isOverdue = isOverdue;
    return this;
  }

  public TaskAggregationSpecificationBuilder setWasAssignedByOther(Boolean wasAssignedByOther) {
    this.wasAssignedByOther = wasAssignedByOther;
    return this;
  }

  public TaskAggregationSpecificationBuilder setSortBy(GetTasksSortByDto sortBy) {
    this.sortBy = sortBy;
    return this;
  }

  public TaskAggregationSpecificationBuilder setSortOrder(GetTasksSortOrderDto sortOrder) {
    this.sortOrder = sortOrder;
    return this;
  }

  public TaskAggregationSpecificationBuilder setLimit(Integer limit) {
    this.limit = limit;
    return this;
  }

  public TaskAggregationSpecificationBuilder setOffset(Integer offset) {
    this.offset = offset;
    return this;
  }

  public TaskAggregationSpecification createTaskAggregationSpecification() {
    return new TaskAggregationSpecification(
        assigneeId,
        assignedById,
        businessModules,
        taskTypes,
        taskStatuses,
        hasDueAt,
        isOverdue,
        wasAssignedByOther,
        sortBy,
        sortOrder,
        limit,
        offset);
  }
}
