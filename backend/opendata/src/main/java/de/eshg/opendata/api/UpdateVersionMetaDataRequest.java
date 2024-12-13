/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.Set;
import org.hibernate.validator.constraints.URL;

public record UpdateVersionMetaDataRequest(
    @NotNull long version,
    @NotEmpty String versionName,
    @Pattern(
            regexp = "^[\\w\\-\\. ]+$",
            message =
                "Invalid file name. Only alphanumeric characters, hyphens, dots, and spaces are allowed.")
        String fileName,
    String description,
    @NotEmpty @URL String licence,
    @NotNull Set<BusinessModule> sources,
    @Past LocalDate statisticStartDate,
    @Past LocalDate statisticEndDate) {}
