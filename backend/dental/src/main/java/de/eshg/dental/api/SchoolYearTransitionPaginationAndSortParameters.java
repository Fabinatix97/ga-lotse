/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import jakarta.validation.constraints.Min;

public record SchoolYearTransitionPaginationAndSortParameters(
    SchoolYearTransitionSortKey sortKey,
    SortDirection sortDirection,
    @Min(0) Integer pageNumber,
    @Min(1) Integer pageSize)
    implements PaginationParameters, SortParameters<SchoolYearTransitionSortKey> {}
