/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(name = "DataSource")
public record DataSourceDto(
    @NotBlank String businessModuleName,
    @NotNull UUID id,
    @NotNull @Size(min = 1) @Valid List<BusinessDataAttribute> attributeCodes) {}
