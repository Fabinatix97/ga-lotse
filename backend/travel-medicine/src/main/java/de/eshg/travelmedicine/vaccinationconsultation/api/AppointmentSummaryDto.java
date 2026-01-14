/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "AppointmentSummary")
public record AppointmentSummaryDto(
    @NotNull UUID procedureStepId,
    Instant start,
    Instant end,
    LocalDate earliestDate,
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType) {}
