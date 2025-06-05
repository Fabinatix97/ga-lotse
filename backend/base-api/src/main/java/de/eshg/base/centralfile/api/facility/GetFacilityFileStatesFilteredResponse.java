/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetFacilityFileStatesFilteredResponse(
    @NotNull long totalNumberOfElements,
    @ArraySchema(
            arraySchema = @Schema(description = "A list of requested File States of Facilities."))
        @Valid
        @NotNull
        List<GetFacilityFileStateResponse> facilityFileStates) {}
