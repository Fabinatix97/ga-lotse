/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.util.UUID;

public record UpdateProstituteProtectionProcedureRequest(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30")
        @NotNull
        @Positive
        Integer durationInMinutes,
    @Schema(description = "User id of the appointments consultant.") UUID consultantId) {}
