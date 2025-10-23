/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;

public record ResourceFilterParameters(
    @Parameter(
            description = "The name of the Resource (or parts of it) which shall be searched for.")
        String name,
    @Parameter(description = "A filter for the possible types of a Resource.") ResourceTypeDto type,
    @Parameter(
            description =
                "A filter for labels that are used for Resources. Only one label can be specified at a time.")
        String label,
    @Parameter(description = "The parameter by which to sort.") ResourceSortKey sortKey,
    @Parameter(description = "The direction by which to sort.") SortDirection sortDirection,
    @Parameter(
            description =
                "Part of pagination. Specifies the page of the paginated items that is returned in the response.")
        @Min(0)
        Integer pageNumber,
    @Parameter(
            description =
                "Part of pagination. Specifies the number of items which shall be on a single page. Only this amount of items is returned in the response.")
        @Min(1)
        Integer pageSize)
    implements PaginationParameters, SortParameters<ResourceSortKey> {}
