/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMax;

@Schema(name = "HivStiConsultationAppointmentStandardDurations")
public record HivStiConsultationAppointmentStandardDurationsDto(
    @NotNull @DurationMax(minutes = 1000L) Duration resultsReview,
    @NotNull @DurationMax(minutes = 1000L) Duration consultation) {}
