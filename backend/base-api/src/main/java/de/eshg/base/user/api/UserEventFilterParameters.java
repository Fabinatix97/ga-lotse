/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UserEventFilterParameters(
    @Parameter(description = "Filter by event type.") UserEventTypeDto type,
    @Parameter(
            description =
                "Part of pagination. Specifies the offset of the first element in the response.")
        @NotNull
        @Min(0)
        Integer offset,
    @Parameter(
            description =
                "Part of pagination. Specifies the number of items which shall be retrieved. Only this amount of items is returned in the response.")
        @NotNull
        @Min(1)
        Integer limit) {}
