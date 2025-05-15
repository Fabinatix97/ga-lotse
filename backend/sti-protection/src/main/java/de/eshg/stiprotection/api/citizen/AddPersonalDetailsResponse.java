/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.stiprotection.api.ConcernDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.Instant;
import java.time.Year;
import java.util.UUID;

public record AddPersonalDetailsResponse(
    @NotNull ConcernDto concern,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @NotNull @Past @Schema(description = "Indicates the year of birth of the person.")
        Year yearOfBirth,
    @Schema(description = "An unique identifier for the STI protection procedure.") @NotNull
        UUID procedureId) {}
