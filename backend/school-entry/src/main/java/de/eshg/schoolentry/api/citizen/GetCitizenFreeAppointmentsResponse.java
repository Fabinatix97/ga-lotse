/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(description = "Fetch all free appointments in the configured period.")
public record GetCitizenFreeAppointmentsResponse(
    @NotNull @Valid List<AppointmentDto> freeAppointments) {}
