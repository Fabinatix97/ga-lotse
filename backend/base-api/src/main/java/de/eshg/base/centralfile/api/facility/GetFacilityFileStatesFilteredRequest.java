/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record GetFacilityFileStatesFilteredRequest(
    @ArraySchema(
            arraySchema =
                @Schema(description = "A list of Ids for requested Facility File States."))
        @Size(min = 1)
        List<UUID> fileStateIds,
    String name,
    String postalCode,
    String city,
    String street,
    String houseNumber,
    @Schema(defaultValue = "0", type = "integer") @Min(0) @Max(200) Integer pageNumber,
    @Schema(defaultValue = "25", type = "integer") @Min(1) @Max(2000) Integer pageSize,
    @Parameter(
            description = "list of sort criteria",
            example = "?sort=postalCode|asc&sort=name|desc")
        List<String> sort) {}
