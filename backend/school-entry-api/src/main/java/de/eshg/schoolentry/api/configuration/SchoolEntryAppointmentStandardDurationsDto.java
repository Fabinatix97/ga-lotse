/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "SchoolEntryAppointmentStandardDurations")
public record SchoolEntryAppointmentStandardDurationsDto(
    @NotNull Duration canChild,
    @NotNull Duration entryLevel,
    @NotNull Duration regularExamination,
    @NotNull Duration specialNeeds,
    @NotNull Duration extraDuration) {}
