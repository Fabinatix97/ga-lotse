/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record CreateMedsAbroadProcedureRequest(
    @NotNull @Valid PersonDto person,
    @Schema(description = "The start date and time of the appointment.") Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30") @Positive
        Integer durationInMinutes) {}
