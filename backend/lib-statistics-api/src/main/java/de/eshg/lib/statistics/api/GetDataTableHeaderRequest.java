/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GetDataTableHeaderRequest(
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @NotNull UUID dataSourceId,
    @NotNull boolean anonymizationRequired,
    @NotNull List<String> attributeCodes)
    implements GetDataInformationRequest {}
