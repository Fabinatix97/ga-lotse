/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ResourceCalendar(@NotNull UUID calendarId, @NotNull UUID resourceId) {}
