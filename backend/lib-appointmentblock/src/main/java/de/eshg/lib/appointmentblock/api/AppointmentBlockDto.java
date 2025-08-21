/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import de.eshg.base.user.api.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Schema(name = "AppointmentBlock")
public record AppointmentBlockDto(
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
    @NotNull List<AppointmentTypeDto> types,
    @NotNull List<UUID> physicians,
    @NotNull List<UUID> mfas,
    @NotNull List<UUID> consultants,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers,
    @NotNull int bookedAppointments,
    @NotNull @Size(min = 1, max = 10) @Valid List<AppointmentBlockBinDto> appointmentBlockBins,
    Boolean availableForCitizen,
    Boolean availableForBulkBooking) {}
