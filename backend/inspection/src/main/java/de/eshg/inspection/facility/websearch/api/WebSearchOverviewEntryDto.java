/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "WebSearchOverviewEntry")
public record WebSearchOverviewEntryDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull String basicURL,
    @NotNull String searchCity,
    @NotNull WebSearchStatusDto searchStatus,
    Integer facilityCount,
    Instant runningSince,
    Instant lastExecution,
    Instant lastSuccessfulExecution) {}
