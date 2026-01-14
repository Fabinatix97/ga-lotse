/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.appointment.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PostOmsAppointmentRequest(
    @NotNull AppointmentTypeDto appointmentType, @Valid BookingInfoDto bookingInfo) {}
