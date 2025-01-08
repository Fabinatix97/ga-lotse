/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record UpdateAppointmentRequest(
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @NotNull Instant appointmentStart,
    @NotNull @Positive Integer durationInMinutes) {}
