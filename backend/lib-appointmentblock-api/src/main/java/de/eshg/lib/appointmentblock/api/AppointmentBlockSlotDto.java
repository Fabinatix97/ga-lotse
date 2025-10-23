/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "AppointmentBlockSlot", description = "A free time slot or a booked appointment")
public record AppointmentBlockSlotDto(
    @NotNull Instant start,
    @NotNull Instant end,
    @NotNull boolean booked,
    AppointmentTypeDto appointmentType,
    Long appointmentId,
    String information,
    UUID procedureId) {}
