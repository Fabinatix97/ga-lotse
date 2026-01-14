/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspUpdateFacilityRequest")
@Valid
public record InspUpdateFacilityRequest(
    @NotNull UUID procedureId,
    @NotNull @Valid AddFacilityFileStateRequest baseFacility,
    Boolean banned) {}
