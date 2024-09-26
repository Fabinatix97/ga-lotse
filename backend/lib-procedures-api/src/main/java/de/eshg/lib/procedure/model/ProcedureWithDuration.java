/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record ProcedureWithDuration(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    @NotNull @Schema(description = "A duration in ISO 8601") String duration) {}
