/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "ServicePlanGroup")
public record ServicePlanGroupDto(
    @NotNull @Valid List<ServicePlanEntryDto> servicePlanEntries,
    UUID procedureStepId,
    Instant appointment,
    AppointmentTypeDto appointmentType,
    AppointmentBookingTypeDto appointmentBookingType,
    LocalDate earliestDate,
    @NotNull BigDecimal fee,
    Boolean medicalHistoryCompleted,
    Boolean citizenHasAnswered) {}
