/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record AddSamplingPointFileStatesResponse(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list containing the file state IDs of the added sampling points"))
        @NotNull
        List<UUID> samplingPointFileStateIds) {}
