/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.Year;
import java.util.UUID;

@Schema(name = "StiProtectionProcedureOverview")
public record StiProtectionProcedureOverviewDto(
    @Schema(description = "An unique identifier for the STI protection procedure.") @NotNull
        UUID id,
    @Schema(description = "The timestamp indicating when the procedure was created.") @NotNull
        Instant createdAt,
    @Schema(description = "The current status of the procedure.") @NotNull
        ProcedureStatusDto status,
    @NotNull ConcernDto concern,
    @Schema(
            type = "integer",
            description = "Indicates the year of birth of the person.",
            example = "1996")
        @NotNull
        Year yearOfBirth,
    CountryCode countryOfBirth,
    @NotNull GenderDto gender,
    @Valid AppointmentDto appointment,
    @Schema(description = "Unique code for patient identification.", example = "h28RQNDRXoffRMzqM")
        String accessCode,
    @NotNull LabStatusDto labStatus,
    @Schema(
            description = "Barcode for tracking the results with the external laboratory.",
            example = "Lab-586172")
        String sampleBarCode,
    @Schema(description = "The start date and time of the appointment.") Instant appointmentStart,
    @NotNull StiProcedureOriginDto procedureOrigin) {}
