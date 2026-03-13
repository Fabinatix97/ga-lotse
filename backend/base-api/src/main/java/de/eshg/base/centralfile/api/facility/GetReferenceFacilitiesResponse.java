/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetReferenceFacilitiesResponse(
    @ArraySchema(arraySchema = @Schema(description = "A list of requested Reference Facilities."))
        @Valid
        @NotNull
        Map<UUID, GetReferenceFacilityResponse> facilityByCFSId,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list containing the IDs of those requested reference facilities which could not be found in the database.",
                    example =
                        "['ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1','df384786-9f85-4404-a9fd-33391da2d2b4','8b93ac7d-a059-437a-9834-e12d1346d088']"))
        @NotNull
        List<UUID> notFoundIds) {}
