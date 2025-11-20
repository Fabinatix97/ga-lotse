/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UpdateAppointmentBlockRequest(
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
    @NotNull @Min(1) @Max(10) int parallelExaminations,
    @NotNull List<UUID> physicians,
    @NotNull List<UUID> mfas,
    @NotNull List<UUID> consultants,
    String room) {}
