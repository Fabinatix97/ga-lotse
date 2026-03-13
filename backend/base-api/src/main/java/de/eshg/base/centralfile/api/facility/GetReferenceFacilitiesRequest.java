/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record GetReferenceFacilitiesRequest(
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of file state Ids for requested Reference Facilities."))
        @NotNull
        @Size(min = 1)
        List<UUID> fileStateIds) {}
