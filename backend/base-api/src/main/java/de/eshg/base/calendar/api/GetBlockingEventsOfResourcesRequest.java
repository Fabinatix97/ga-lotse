/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GetBlockingEventsOfResourcesRequest(
    @NotNull @Size(min = 1) List<UUID> resourceIds,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd) {}
