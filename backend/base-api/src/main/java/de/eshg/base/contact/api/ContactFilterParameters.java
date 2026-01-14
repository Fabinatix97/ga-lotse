/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.api.commons.PaginationParameters;
import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;
import java.util.Set;

public record ContactFilterParameters(
    @Parameter(
            description =
                "The full name of the Contact (or parts of it) which shall be searched for.")
        String name,
    @Parameter(
            description =
                "The street, as the main part of the address of a Contact, (or parts of it) which shall be searched for.")
        String street,
    @Parameter(description = "A filter for the possible types of Contacts.") ContactTypeDto type,
    @Parameter(description = "A filter for the possible categories of Institutions.")
        Set<InstitutionContactCategoryDto> categories,
    @Parameter(description = "The parameter by which to sort.") ContactSortKey sortKey,
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
    implements PaginationParameters, SortParameters<ContactSortKey> {}
