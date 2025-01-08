/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AppointmentTypeConfig")
public record AppointmentTypeConfigDto(
    @NotNull UUID id,
    @NotNull AppointmentTypeDto appointmentTypeDto,
    @NotNull @Min(0) int standardDurationInMinutes) {}
