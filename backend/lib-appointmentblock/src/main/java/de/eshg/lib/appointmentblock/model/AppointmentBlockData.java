/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import java.time.Instant;

public record AppointmentBlockData(
    AppointmentBlock appointmentBlock,
    Instant start,
    Instant end,
    long numberOfFreeAppointments,
    long numberOfBookedAppointments) {}
