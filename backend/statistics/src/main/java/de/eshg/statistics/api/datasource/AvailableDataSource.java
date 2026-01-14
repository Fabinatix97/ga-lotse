/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record AvailableDataSource(
    @NotNull String businessModuleName,
    @NotNull boolean sensitiveDataAllowed,
    @NotNull UUID id,
    @NotBlank String name,
    @NotNull DataSourceSensitivity sensitivity,
    @NotNull boolean canBeAnonymized,
    @NotNull @Valid List<BusinessDataSourceAttribute> attributes) {}
