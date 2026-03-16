/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.Instant;

@Schema(name = "AppointmentSummary")
public record AppointmentSummaryDto(
    @NotNull Instant start,
    @NotNull Duration duration,
    @NotNull AppointmentTypeDto appointmentType) {}
