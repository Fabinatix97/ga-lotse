/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "InfectionBriefingAppointmentStandardDurations")
public record InfectionBriefingAppointmentStandardDurationsDto(
    @NotNull Duration infectionBriefingNew, @NotNull Duration infectionBriefingReplacement) {}
