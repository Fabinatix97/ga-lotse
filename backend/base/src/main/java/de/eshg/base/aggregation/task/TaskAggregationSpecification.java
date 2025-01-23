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
import java.util.Set;
import java.util.UUID;

public record TaskAggregationSpecification(
    UUID assigneeId,
    Set<UUID> assignedById,
    Set<BusinessModule> businessModules,
    Set<TaskTypeDto> taskTypes,
    Set<TaskStatusDto> taskStatuses,
    GetTasksSortByDto sortBy,
    GetTasksSortOrderDto sortOrder,
    Integer limit,
    Integer offset) {}
