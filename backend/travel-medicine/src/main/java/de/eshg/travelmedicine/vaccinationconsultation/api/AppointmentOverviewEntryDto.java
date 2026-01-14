/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "AppointmentOverviewEntry")
public record AppointmentOverviewEntryDto(
    @NotNull UUID procedureId,
    @NotBlank String lastName,
    @NotBlank String firstName,
    @NotNull LocalDate dateOfBirth,
    @NotNull int age,
    LocalDate travelStartDate,
    @NotNull CreatedByUserTypeDto createdBy,
    @NotNull ProcedureStatusDto status,
    @NotNull AppointmentTypeDto appointmentType,
    Instant appointment,
    LocalDate earliestDate,
    AppointmentBookingTypeDto appointmentBookingType) {}
