/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "WeeklyDataBin")
public record WeeklyDataBinDto(@NotNull LocalDate lowerBound, @NotNull long count) {}
