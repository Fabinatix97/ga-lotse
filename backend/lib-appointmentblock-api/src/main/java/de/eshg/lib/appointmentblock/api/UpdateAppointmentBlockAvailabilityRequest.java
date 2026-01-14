/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.Valid;

public record UpdateAppointmentBlockAvailabilityRequest(
    @Valid AppointmentBlockDefaultAvailabilityFlagsDto defaultFlags,
    @Valid LeadTimeForAppointmentCreationDto leadTimes) {}
