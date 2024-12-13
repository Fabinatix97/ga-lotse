/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetOpenDocumentsResponse(
    @NotNull @Schema(description = "Total number of result pages for the given filter criteria")
        int totalPages,
    @NotNull @Schema(description = "Total number of result elements for the given filter criteria")
        long totalElements,
    @Valid @NotNull List<ResourceDto> elements) {}
