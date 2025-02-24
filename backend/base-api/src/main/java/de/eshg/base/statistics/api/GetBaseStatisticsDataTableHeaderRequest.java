/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetBaseStatisticsDataTableHeaderRequest(
    @NotBlank String dataSourceName, @NotNull List<String> attributeCodes) {}
