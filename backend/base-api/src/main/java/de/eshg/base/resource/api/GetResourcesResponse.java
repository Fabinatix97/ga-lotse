/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import de.eshg.base.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetResourcesResponse(
    @NotNull @Valid List<ResourceDto> elements,
    @Schema(description = "The total number of Resources in the response.") @NotNull @Min(0)
        long totalNumberOfElements)
    implements PagedResponse<ResourceDto> {}
