/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    description =
        "Base events are events like vacations that are not related to any business module.")
public record BaseEventRequest(
    @NotNull UUID calendarId,
    @NotNull BaseEventTypeDto type,
    String subject,
    @Valid @NotNull EventTimeData timeData) {}
