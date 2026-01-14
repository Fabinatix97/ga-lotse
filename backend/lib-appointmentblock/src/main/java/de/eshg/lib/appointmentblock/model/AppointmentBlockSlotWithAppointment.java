/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.time.Instant;

public record AppointmentBlockSlotWithAppointment(
    Instant start, Instant end, Appointment appointment) {}
