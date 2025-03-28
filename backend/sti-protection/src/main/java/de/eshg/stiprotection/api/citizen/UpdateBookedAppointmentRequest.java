/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record UpdateBookedAppointmentRequest(
    @NotNull Instant appointmentStart, @NotNull @Positive Integer durationInMinutes)
    implements TimetableEntry {}
