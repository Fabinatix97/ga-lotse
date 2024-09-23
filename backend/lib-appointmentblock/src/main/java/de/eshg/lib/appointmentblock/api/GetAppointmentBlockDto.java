/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(
    name = "GetAppointmentBlock",
    description =
        "A planned appointment block. Appointment blocks offer a set of bookable appointments at different times within the timeframe of the appointment block.")
public record GetAppointmentBlockDto(
    @NotNull
        @Schema(
            description = "Id of the AppointmentBlock.",
            example = "a765534d-760a-417d-8639-5e2fd59246e2")
        UUID id,
    @NotNull
        @Schema(
            description = "Time at which the appointment block starts.",
            example = "2016-01-01T01:00:00.123456+01:00")
        Instant start,
    @NotNull
        @Schema(
            description = "Time at which the appointment block ends.",
            example = "2016-01-01T01:45:00.123456+01:00")
        Instant end,
    @NotNull @Min(0) long numberOfFreeAppointments,
    @NotNull @Min(0) long numberOfBookedAppointments) {}
