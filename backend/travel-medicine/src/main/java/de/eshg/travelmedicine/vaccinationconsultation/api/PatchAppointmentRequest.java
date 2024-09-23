/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;
import java.time.LocalDate;

public record PatchAppointmentRequest(
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    Instant appointmentStart,
    @PositiveOrZero Integer durationInMinutes,
    LocalDate earliestDate) {}
