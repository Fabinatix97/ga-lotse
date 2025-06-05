/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(name = "GetAppointmentBlockGroup")
public record GetAppointmentBlockGroupDto(
    @NotNull
        @Schema(
            description = "Id of the AppointmentBlockGroup.",
            example = "a765534d-760a-417d-8639-5e2fd59246e2")
        UUID id,
    @NotNull @Size(min = 1) List<AppointmentTypeDto> types,
    @NotNull @Min(1) @Max(10) int parallelExaminations,
    @Valid LocationDto location,
    @Valid @NotNull @NotEmpty List<GetAppointmentBlockDto> appointmentBlocks) {}
