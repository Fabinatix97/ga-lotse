/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import jakarta.validation.constraints.Min;

public record WaitingRoomProcedurePaginationAndSortParameters(
    WaitingRoomSortKey sortKey,
    SortDirection sortDirection,
    @Min(0) Integer pageNumber,
    @Min(1) Integer pageSize)
    implements PaginationParameters, SortParameters<WaitingRoomSortKey> {}
