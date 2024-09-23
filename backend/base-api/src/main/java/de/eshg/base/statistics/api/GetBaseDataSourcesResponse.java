/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetBaseDataSourcesResponse(
    @NotNull @Valid List<BaseAvailableDataSource> baseAvailableDataSources) {}
