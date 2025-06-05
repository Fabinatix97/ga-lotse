/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMax;

@Schema(name = "MeaslesProtectionAppointmentStandardDurations")
public record MeaslesProtectionAppointmentStandardDurationsDto(
    @NotNull @DurationMax(minutes = 1000L) Duration proofSubmission) {}
