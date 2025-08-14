/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateProceduresBulkResponse(
    @NotNull @Min(0) int numUpdated,
    @NotNull @Min(0) int numError,
    @NotNull @Min(0) int numUnmodified) {}
