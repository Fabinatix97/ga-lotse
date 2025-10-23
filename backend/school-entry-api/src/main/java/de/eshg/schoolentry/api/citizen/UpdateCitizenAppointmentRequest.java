/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Citizen appointment update.")
public record UpdateCitizenAppointmentRequest(@NotNull @Valid AppointmentDto newAppointment) {}
