/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record StatisticInfo(
    @NotNull UUID id,
    @NotNull UUID userId,
    @NotBlank String name,
    @NotNull @Size(min = 1) List<String> dataSourceNames,
    @NotNull StatisticStateDto state,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull Instant createdAt,
    @NotNull boolean anonymized) {}
