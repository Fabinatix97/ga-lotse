/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record EventTimeData(
    @NotNull Instant start, @NotNull Instant end, @NotNull boolean wholeDay) {}
