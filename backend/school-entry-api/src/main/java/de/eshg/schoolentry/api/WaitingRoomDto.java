/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "WaitingRoom")
public record WaitingRoomDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Size(max = 60) String description,
    WaitingStatusDto status) {}
