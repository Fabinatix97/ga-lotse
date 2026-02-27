/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ModuleCalendar(@NotNull UUID calendarId, @NotNull BusinessModule businessModule) {}
