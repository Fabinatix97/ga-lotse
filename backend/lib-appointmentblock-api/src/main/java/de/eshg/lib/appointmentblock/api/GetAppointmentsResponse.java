/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAppointmentsResponse(
    @NotNull @Valid List<AppointmentBlockSlotDto> appointmentBlockSlots) {}
