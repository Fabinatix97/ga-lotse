/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record PostUserDefinedAppointmentRequest(
    @NotNull Instant appointmentStart, @NotNull Instant appointmentEnd) {}
