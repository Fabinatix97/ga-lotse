/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetDataSourcesResponse(@Valid @NotNull List<DataSourceInfo> dataSources) {}
