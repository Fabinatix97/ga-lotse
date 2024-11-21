/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetPersonFileStatesResponse(
    @ArraySchema(arraySchema = @Schema(description = "A list of person file states"))
        @Valid
        @NotNull
        List<GetPersonFileStateResponse> personFileStates,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list containing the IDs of those requested person file states which could not be found in the database during a bulk-get operation.",
                    example =
                        "['ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1','df384786-9f85-4404-a9fd-33391da2d2b4','8b93ac7d-a059-437a-9834-e12d1346d088']"))
        @NotNull
        List<UUID> notFoundIds) {}
