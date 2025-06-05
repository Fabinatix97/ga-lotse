/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMax;

@Schema(name = "OmsAppointmentStandardDurations")
public record OmsAppointmentStandardDurationsDto(
    @NotNull @DurationMax(minutes = 1000L) Duration officialMedicalServiceShort,
    @NotNull @DurationMax(minutes = 1000L) Duration officialMedicalServiceLong) {}
