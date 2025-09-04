/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.Valid;

public record GetAppointmentBlockDefaultAvailabilityFlagsResponse(
    @Valid AppointmentBlockDefaultAvailabilityDto defaultFlags) {}
