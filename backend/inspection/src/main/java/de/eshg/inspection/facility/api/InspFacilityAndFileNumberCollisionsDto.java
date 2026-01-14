/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.inspection.inspection.api.GetFileNumberCollisionsResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "InspFacilityAndFileNumberCollisions")
public record InspFacilityAndFileNumberCollisionsDto(
    @NotNull @Valid InspFacilityDto facility,
    @Valid GetFileNumberCollisionsResponse fileNumberCollisionsResponse) {}
