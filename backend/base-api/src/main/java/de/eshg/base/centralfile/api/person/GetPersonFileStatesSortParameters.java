/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GetPersonFileStatesSortParameters(
    @NotNull GetPersonsSortKey sortKey,
    @NotNull SortDirection sortDirection,
    @Min(0) Integer pageNumber,
    @Min(1) Integer pageSize)
    implements SortParameters<GetPersonsSortKey>, PaginationParameters {}
