/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper.api;

import jakarta.validation.constraints.NotNull;

public record CreateCalendarTestEventsRequest(
    @NotNull int wholeDayEventCount, @NotNull int subDayEventCount) {}
