/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetTaskByUserResponse(
    @NotNull @Valid Map<UUID, List<TaskDto>> tasksByUser,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers) {}
