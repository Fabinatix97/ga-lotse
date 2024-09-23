/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PostProcedureStepRequest(
    @NotNull @Size(min = 1) List<UUID> services,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    Instant appointmentStart,
    Integer durationInMinutes,
    LocalDate earliestDate) {}
