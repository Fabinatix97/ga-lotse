/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.stiprotection.api.ConcernDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record BookAppointmentRequest(
    @NotNull ConcernDto concern,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30")
        @NotNull
        @Positive
        Integer durationInMinutes)
    implements TimetableEntry {}
