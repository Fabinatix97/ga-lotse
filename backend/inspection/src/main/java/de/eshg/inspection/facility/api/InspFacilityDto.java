/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspFacility")
public record InspFacilityDto(
    @NotNull UUID id,
    @NotNull @Valid GetFacilityFileStateResponse baseFacility,
    @NotNull boolean banned,
    @Valid ObjectTypeDto objectType) {}
