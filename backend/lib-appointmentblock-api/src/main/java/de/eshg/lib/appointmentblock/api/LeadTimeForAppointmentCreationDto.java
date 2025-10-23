/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "DefaultLeadTimeForAppointmentCreation",
    description = "Default lead time in days for the appointment creation UI")
public record LeadTimeForAppointmentCreationDto(
    @NotNull int bulkCreateAppointmentsMinLeadTime,
    @NotNull int citizenFreeAppointmentsMinLeadTime,
    @NotNull int citizenFreeAppointmentsMaxLeadTime) {}
