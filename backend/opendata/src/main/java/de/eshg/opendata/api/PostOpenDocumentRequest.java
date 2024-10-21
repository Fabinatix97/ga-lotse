/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;
import org.hibernate.validator.constraints.URL;

public record PostOpenDocumentRequest(
    @NotEmpty String versionName,
    @Schema(
            description =
                """
                If set, and a resource with the same value already exists in the database,
                the version is added to this resource. Otherwise, a new resource is created.

                If this value is not set, a new resource with a generated UUID as `resourceName` is created.
                """)
        String resourceName,
    @Schema(
            description =
                "Either set `statisticsStartDate` and `statisticsEndDate` together or not at all.")
        LocalDate statisticStartDate,
    @Schema(
            description =
                "Either set `statisticsStartDate` and `statisticsEndDate` together or not at all.")
        LocalDate statisticEndDate,
    @NotNull Set<BusinessModule> sources,
    String description,
    @NotEmpty @URL String licence) {}
