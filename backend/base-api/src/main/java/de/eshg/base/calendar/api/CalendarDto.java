/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "Calendar")
public record CalendarDto(
    @NotNull UUID id,
    @NotNull CalendarTypeDto type,
    String globalCalendarName,
    UUID userId,
    UUID resourceId) {}
