/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record CreateAppointmentRequest(
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull Instant appointmentStart,
    @NotNull @Positive Integer durationInMinutes) {}
