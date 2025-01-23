/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PostOmsAppointmentRequest(
    @NotNull AppointmentTypeDto appointmentType, @Valid BookingInfoDto bookingInfo) {}
