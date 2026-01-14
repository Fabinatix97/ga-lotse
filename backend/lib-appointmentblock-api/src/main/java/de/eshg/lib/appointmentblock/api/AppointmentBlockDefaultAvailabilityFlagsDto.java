/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "AppointmentBlockDefaultAvailabilityFlags",
    description = "Default availability flags for the appointment block creation UI")
public record AppointmentBlockDefaultAvailabilityFlagsDto(
    @NotNull boolean availableForCitizen, @NotNull boolean availableForBulkBooking) {}
