/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserCalendar(@NotNull UUID calendarId, @NotNull UUID userId) {}
