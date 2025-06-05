/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMax;

@Schema(name = "TravelMedicineAppointmentStandardDurations")
public record TravelMedicineAppointmentStandardDurationsDto(
    @NotNull @DurationMax(minutes = 1000L) Duration consultation,
    @NotNull @DurationMax(minutes = 1000L) Duration vaccination) {}
