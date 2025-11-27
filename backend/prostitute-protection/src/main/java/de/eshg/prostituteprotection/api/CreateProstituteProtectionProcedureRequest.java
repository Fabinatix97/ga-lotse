/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.util.List;

public record CreateProstituteProtectionProcedureRequest(
    @NotNull String alias,
    @NotNull List<LanguageDto> languages,
    ConsultationTypeDto consultationType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30")
        @NotNull
        @Positive
        Integer durationInMinutes) {}
