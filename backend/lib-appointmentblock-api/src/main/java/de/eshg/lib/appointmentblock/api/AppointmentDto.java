/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "Appointment", description = "Appointment of a procedure.")
public record AppointmentDto(
    @NotNull Instant start, @NotNull Instant end, UUID appointmentBlockId) {

  public AppointmentDto(Instant start, Instant end) {
    this(start, end, null);
  }
}
