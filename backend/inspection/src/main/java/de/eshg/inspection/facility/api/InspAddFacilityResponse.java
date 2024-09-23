/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspAddFacilityResponse")
public record InspAddFacilityResponse(
    @Valid InspFacilityDto facility,
    @NotNull UUID procedureId,
    @NotNull ProcedureStatusDto procedureStatus) {}
