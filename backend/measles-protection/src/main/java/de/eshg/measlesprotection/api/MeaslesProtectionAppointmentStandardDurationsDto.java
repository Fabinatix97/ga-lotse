/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "MeaslesProtectionAppointmentStandardDurations")
public record MeaslesProtectionAppointmentStandardDurationsDto(@NotNull Duration proofSubmission) {}
