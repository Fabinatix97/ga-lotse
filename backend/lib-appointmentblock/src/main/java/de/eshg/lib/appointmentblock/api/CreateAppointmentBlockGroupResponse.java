/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record CreateAppointmentBlockGroupResponse(
    @NotNull
        @Schema(
            description = "Id of the AppointmentBlockGroup.",
            example = "a765534d-760a-417d-8639-5e2fd59246e2")
        UUID id,
    @NotNull @NotEmpty List<UUID> appointmentBlockIds) {}
