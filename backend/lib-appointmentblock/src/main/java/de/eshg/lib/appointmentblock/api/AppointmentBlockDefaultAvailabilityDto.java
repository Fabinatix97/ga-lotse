/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "AppointmentBlockDefaultAvailability",
    description = "Default availability flags for the appointment bock creation UI")
public record AppointmentBlockDefaultAvailabilityDto(
    @NotNull boolean availableForCitizen, @NotNull boolean availableForBulkBooking) {}
