/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

@Schema(name = "CreateDailyAppointmentBlock")
public record CreateDailyAppointmentBlockDto(
    @NotNull
        @FutureOrPresent
        @Schema(
            description = "Time at which the appointment block starts.",
            example = "2016-01-01T01:00:00.123456+01:00")
        Instant start,
    @NotNull
        @Future
        @Schema(
            description = "Time at which the appointment block ends.",
            example = "2016-01-01T01:45:00.123456+01:00")
        Instant end,
    @NotEmpty List<DayOfWeekDto> daysOfWeek) {}
