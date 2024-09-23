/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record BlockingEventsOfResource(
    @NotNull UUID resourceId, @Valid @NotNull List<EventWithTimeData> events) {}
