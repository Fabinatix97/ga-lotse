/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAvailableDataSourcesResponse(
    @NotNull @Valid List<AvailableDataSource> availableDataSources,
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
