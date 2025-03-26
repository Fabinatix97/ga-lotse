/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "OmsAppointment")
public record OmsAppointmentDto(
    @NotNull UUID appointmentId,
    @NotNull AppointmentTypeDto appointmentType,
    @NotNull AppointmentStateDto appointmentState,
    @NotNull BookingStateDto bookingState,
    BookingTypeDto bookingType,
    Instant start,
    Integer duration,
    @NotNull int bookingsRemaining,
    String reasonForRejection) {}
