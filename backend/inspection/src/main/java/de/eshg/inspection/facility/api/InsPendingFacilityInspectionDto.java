/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspPendingFacilityInspection")
public record InsPendingFacilityInspectionDto(
    @NotNull UUID id,
    @NotNull ProcedureStatusDto status,
    @NotNull InspectionType type,
    @NotNull InspectionPhase phase,
    @NotNull int numberOfIncidents,
    @NotNull boolean possibleInspectionDuplicate) {}
