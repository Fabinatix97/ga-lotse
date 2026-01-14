/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.api.commons.PaginationParameters;
import jakarta.validation.constraints.Min;

public record ProcedureLabelPaginationParameters(
    @Min(0) Integer pageNumber, @Min(1) Integer pageSize) implements PaginationParameters {}
