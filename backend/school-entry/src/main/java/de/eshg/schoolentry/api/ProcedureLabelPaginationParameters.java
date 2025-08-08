/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.base.PaginationParameters;
import jakarta.validation.constraints.Min;

public record ProcedureLabelPaginationParameters(
    @Min(0) Integer pageNumber, @Min(1) Integer pageSize) implements PaginationParameters {}
