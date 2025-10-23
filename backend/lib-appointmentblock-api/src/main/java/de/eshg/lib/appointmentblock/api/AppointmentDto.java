/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "Appointment", description = "Appointment of a procedure.")
public record AppointmentDto(@NotNull Instant start, @NotNull Instant end) {}
