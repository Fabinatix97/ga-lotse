/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Citizen appointment update.")
public record UpdateCitizenAppointmentRequest(@NotNull @Valid AppointmentDto newAppointment) {}
