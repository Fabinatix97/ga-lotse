/*
 * Copyright 2026 cronn GmbH
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
  private GetTasksSortByDto sortBy = GetTasksSortByDto.PRIORITY;
  private GetTasksSortOrderDto sortOrder = GetTasksSortOrderDto.ASC;
  private Integer pageSize = 50;
  private Integer pageNumber = 0;

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

  public TaskAggregationSpecificationBuilder setSortBy(GetTasksSortByDto sortBy) {
    this.sortBy = sortBy;
    return this;
  }

  public TaskAggregationSpecificationBuilder setSortOrder(GetTasksSortOrderDto sortOrder) {
    this.sortOrder = sortOrder;
    return this;
  }

  public TaskAggregationSpecificationBuilder setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
    return this;
  }

  public TaskAggregationSpecificationBuilder setPageNumber(Integer pageNumber) {
    this.pageNumber = pageNumber;
    return this;
  }

  public TaskAggregationSpecification createTaskAggregationSpecification() {
    return new TaskAggregationSpecification(
        assigneeId,
        assignedById,
        businessModules,
        taskTypes,
        taskStatuses,
        sortBy,
        sortOrder,
        pageSize,
        pageNumber);
  }
}
