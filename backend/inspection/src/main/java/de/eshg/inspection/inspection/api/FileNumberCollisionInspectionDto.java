/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record FileNumberCollisionInspectionDto(
    @NotNull UUID inspectionId,
    @NotNull String facilityName,
    @NotNull ProcedureStatus inspectionStatus,
    LocalDate dayOfInspection) {}
