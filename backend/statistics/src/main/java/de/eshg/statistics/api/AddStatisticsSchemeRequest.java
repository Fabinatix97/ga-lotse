/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddStatisticsSchemeRequest(
    @NotBlank String name,
    @NotNull @Size(min = 1, max = 1) @Valid List<DataSourceDto> dataSources) {}
