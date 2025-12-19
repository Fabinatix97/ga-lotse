/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.api.commons.PaginationParameters;
import jakarta.validation.constraints.Min;

public record ProcedureLabelPaginationParameters(
    @Min(0) Integer pageNumber, @Min(1) Integer pageSize) implements PaginationParameters {}
