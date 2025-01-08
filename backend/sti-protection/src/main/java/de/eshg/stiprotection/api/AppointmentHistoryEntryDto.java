/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "AppointmentHistoryEntry")
public record AppointmentHistoryEntryDto(
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull Instant appointmentStart,
    @NotNull AppointmentStatusDto appointmentStatus) {}
