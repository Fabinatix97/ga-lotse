/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.task;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetAggregatedTasksResponse(
    @NotNull @Schema(description = "total number of  tasks for this query") long count,
    @Valid @NotNull @Size(max = 200) List<TaskDto> tasks,
    @Valid @NotNull Map<UUID, UserDto> resolvedUsers,
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
