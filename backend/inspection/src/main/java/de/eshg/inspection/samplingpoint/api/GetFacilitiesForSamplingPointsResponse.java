/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint.api;

import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

@Schema(name = "GetFacilitiesForSamplingPointsResponse")
public record GetFacilitiesForSamplingPointsResponse(
    @NotNull @Valid Map<UUID, GetReferenceFacilityResponse> facilities) {}
