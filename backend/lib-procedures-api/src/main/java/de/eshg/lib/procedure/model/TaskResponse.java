/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record TaskResponse(
    @NotNull @Schema(description = "total number of tasks for this query") long count,
    @NotNull @Size(max = 200) @Valid List<TaskDto> tasks) {}
