/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "UserEvent")
public record UserEventDto(
    @NotNull UserEventTypeDto type, String ipAddress, @NotNull Instant timestamp) {}
