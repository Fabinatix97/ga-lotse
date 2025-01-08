/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.lib.common.BusinessModule;
import de.eshg.opendata.domain.model.OpenDataFileType;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.Year;
import java.util.List;

public record GetOpenDocumentsRequest(
    @Parameter(
            description =
                """
                If set only versions with a `statisticsStartDate` or `statisticsEndDate`
                within the given year or whose period from `statisticsStartDate` to
                `statisticsEndDate` covers the given year
                """)
        Year statisticsYearFilter,
    @Parameter(
            description =
                """
                If set, versions with at least one of the given business modules are returned
                """)
        List<BusinessModule> sourcesFilter,
    @Parameter(description = "If set, versions with the given file type are returned")
        OpenDataFileType fileTypeFilter,
    @Parameter(
            description =
                "If set, versions with `fileName` or `description` matching the given search string are returned")
        String searchString) {}
