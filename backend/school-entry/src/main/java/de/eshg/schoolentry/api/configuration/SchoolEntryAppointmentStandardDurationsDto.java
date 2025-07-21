/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
    @NotNull Duration specialNeeds) {}
