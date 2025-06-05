/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.configuration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMax;

@Schema(name = "SchoolEntryAppointmentStandardDurations")
public record SchoolEntryAppointmentStandardDurationsDto(
    @NotNull @DurationMax(minutes = 1000L) Duration canChild,
    @NotNull @DurationMax(minutes = 1000L) Duration entryLevel,
    @NotNull @DurationMax(minutes = 1000L) Duration regularExamination,
    @NotNull @DurationMax(minutes = 1000L) Duration specialNeeds) {}
