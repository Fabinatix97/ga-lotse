/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "TravelMedicineAppointmentStandardDurations")
public record TravelMedicineAppointmentStandardDurationsDto(
    @NotNull Duration consultation, @NotNull Duration vaccination) {}
