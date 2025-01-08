/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record BusinessCaseEventRequest(
    @NotNull @Size(min = 1) List<UUID> calendarIds, @Valid @NotNull EventTimeData timeData) {}
