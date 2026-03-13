/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetReferenceSamplingPointsResponse(
    @ArraySchema(arraySchema = @Schema(description = "A list of reference sampling points"))
        @Valid
        @NotNull
        List<GetReferenceSamplingPointResponse> samplingPoints) {}
