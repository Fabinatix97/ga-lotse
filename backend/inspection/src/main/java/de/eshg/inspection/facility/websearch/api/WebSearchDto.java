/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "WebSearch")
public record WebSearchDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull String basicURL,
    @NotNull String searchCity,
    @NotNull WebSearchStatusDto searchStatus,
    Instant runningSince,
    Instant lastExecution,
    Instant lastSuccessfulExecution,
    @NotNull @Valid List<WebSearchQueryDto> queries) {}
