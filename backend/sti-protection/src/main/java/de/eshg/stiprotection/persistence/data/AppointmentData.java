/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import java.time.Instant;

public record AppointmentData(
    AppointmentBookingType appointmentBookingType,
    AppointmentType appointmentType,
    Instant appointmentStart,
    Integer durationInMinutes) {}
