/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DetailedFacility")
public record DetailedFacilityDto(
    @NotNull @Valid AddFacilityFileStateResponse facilityFileState,
    @NotNull FacilityTypeDto facilityType) {}
