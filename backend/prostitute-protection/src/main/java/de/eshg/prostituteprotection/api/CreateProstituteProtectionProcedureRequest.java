/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateProstituteProtectionProcedureRequest(
    String alias,
    @Size(min = 1, max = 23) String phoneNumber,
    @NotNull List<LanguageDto> languages,
    @NotNull ProcedureTypeDto procedureType,
    UUID consultantId,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30")
        @NotNull
        @Positive
        Integer durationInMinutes) {}
