/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SearchSamplingPointResponse(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of sampling points matching the requested search string"))
        @NotNull
        @Valid
        List<GetSamplingPointFileStateResponse> fileStateIds) {}
