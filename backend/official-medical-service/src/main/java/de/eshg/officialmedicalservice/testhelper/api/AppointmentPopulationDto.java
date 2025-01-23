/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AppointmentPopulation")
public record AppointmentPopulationDto(
    @NotBlank String key, @NotNull @Valid PostOmsAppointmentRequest request) {}
