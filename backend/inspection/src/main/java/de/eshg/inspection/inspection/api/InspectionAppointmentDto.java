/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.base.user.api.UserDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "InspectionAppointment")
public record InspectionAppointmentDto(
    @NotNull Instant start, @NotNull Instant end, @Valid UserDto assignedTo) {}
