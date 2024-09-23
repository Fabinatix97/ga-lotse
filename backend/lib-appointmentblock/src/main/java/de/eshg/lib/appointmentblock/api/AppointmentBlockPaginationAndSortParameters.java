/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.base.SortParameters;
import jakarta.validation.constraints.Min;

public record AppointmentBlockPaginationAndSortParameters(
    AppointmentBlockSortKey sortKey,
    SortDirection sortDirection,
    @Min(0) Integer pageNumber,
    @Min(1) Integer pageSize)
    implements PaginationParameters, SortParameters<AppointmentBlockSortKey> {}
