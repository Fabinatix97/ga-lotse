/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "WebSearchQuery")
public record WebSearchQueryDto(
    @NotNull long id,
    @NotNull String queryName,
    String facilityName,
    String facilityAddress,
    String keywords) {}
