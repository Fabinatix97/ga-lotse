/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AppointmentBlockUser")
public record AppointmentBlockUserDto(
    @Schema(description = "The Id of the user.", example = "fe9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID userId,
    @Schema(description = "The given name(s) of a user.", example = "John") @NotNull
        String firstName,
    @Schema(description = "The last name of a user.", example = "Doe") @NotNull String lastName) {}
