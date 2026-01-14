/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(
    name = "AppointmentHistoryEntry",
    description = "Represents an entry documenting past and upcoming appointments.")
public record AppointmentHistoryEntryDto(
    @NotNull AppointmentTypeDto appointmentType,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @NotNull AppointmentStatusDto appointmentStatus) {}
