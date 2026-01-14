/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record PatchAppointmentRequest(
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @NotNull Instant appointmentStart,
    @NotNull @Positive Integer durationInMinutes) {}
