/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@ValidTimeRange
public record TimeRange(@NotNull Instant start, @NotNull Instant end) {}
