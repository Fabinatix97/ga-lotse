/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AppointmentPopulation")
public record AppointmentPopulationDto(
    @NotBlank String key,
    @NotNull @Valid PostOmsAppointmentRequest request,
    String reasonForRejection) {}
