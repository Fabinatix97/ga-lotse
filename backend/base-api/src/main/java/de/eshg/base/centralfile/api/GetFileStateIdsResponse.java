/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetFileStateIdsResponse(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list of Ids of File States that are associated to the same Reference Data."))
        @NotNull
        List<UUID> fileStateIds) {}
