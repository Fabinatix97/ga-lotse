/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.base.SortParameters;
import jakarta.validation.constraints.Min;

public record TextBlockFilterParameters(
    String searchQuery,
    TextBlockSortKey sortKey,
    SortDirection sortDirection,
    @Min(0) Integer pageNumber,
    @Min(1) Integer pageSize)
    implements PaginationParameters, SortParameters<TextBlockSortKey> {}
