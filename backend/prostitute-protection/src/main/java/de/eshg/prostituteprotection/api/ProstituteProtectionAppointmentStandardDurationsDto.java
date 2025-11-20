/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;

@Schema(name = "ProstituteProtectionAppointmentStandardDurations")
public record ProstituteProtectionAppointmentStandardDurationsDto(@NotNull Duration consultation) {}
