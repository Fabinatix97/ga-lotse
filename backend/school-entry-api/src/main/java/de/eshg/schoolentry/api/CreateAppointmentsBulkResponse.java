/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateAppointmentsBulkResponse(
    @NotNull @Min(0) int numCreated,
    @NotNull @Min(0) int numError,
    @NotNull @Min(0) int numUnmodified) {}
