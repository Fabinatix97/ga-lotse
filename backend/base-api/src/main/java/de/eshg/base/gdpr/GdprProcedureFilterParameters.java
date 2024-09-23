/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.PaginationParameters;
import de.eshg.base.SortDirection;
import de.eshg.base.SortParameters;
import de.eshg.base.gdpr.api.GdprProcedureTypeDto;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;

public record GdprProcedureFilterParameters(
    @Parameter(description = "A filter for a type that GDPR procedures can have.")
        GdprProcedureTypeDto type,
    @Parameter(description = "The parameter by which to sort.") GdprProcedureSortKey sortKey,
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
    implements PaginationParameters, SortParameters<GdprProcedureSortKey> {}
