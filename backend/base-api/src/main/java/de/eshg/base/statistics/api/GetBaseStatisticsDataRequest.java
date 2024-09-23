/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetBaseStatisticsDataRequest(
    @NotBlank String dataSourceName,
    @NotNull List<String> attributeCodes,
    @NotNull List<UUID> centralFileIds) {}
