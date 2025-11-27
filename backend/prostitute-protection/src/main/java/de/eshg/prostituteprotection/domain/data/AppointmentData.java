/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.data;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.prostituteprotection.domain.model.AppointmentBookingType;
import java.time.Instant;

public record AppointmentData(
    AppointmentBookingType appointmentBookingType,
    AppointmentType appointmentType,
    Instant appointmentStart,
    Integer durationInMinutes) {}
