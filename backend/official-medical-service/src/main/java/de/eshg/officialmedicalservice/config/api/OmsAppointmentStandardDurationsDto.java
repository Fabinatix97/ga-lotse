/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "OmsAppointmentStandardDurations")
public record OmsAppointmentStandardDurationsDto(
    @NotNull Duration officialMedicalServiceShort, @NotNull Duration officialMedicalServiceLong) {}
