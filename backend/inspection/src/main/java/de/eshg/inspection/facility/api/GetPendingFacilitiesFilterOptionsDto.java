/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Schema(name = "GetPendingFacilitiesFilterOptions")
public record GetPendingFacilitiesFilterOptionsDto(
    Set<InspPendingFacilityKind> kind,
    String name,
    String postalCode,
    String city,
    String street,
    String fileNumber,
    UUID objectTypeId,
    Set<ProcedureStatusDto> status,
    Set<InspectionType> type,
    Set<InspectionPhase> phase,
    Instant isBefore,
    Instant isAfter,
    Boolean hasDuplicates,
    Boolean banned,
    Boolean unfinishedSamples,
    Boolean suspiciousSamples,
    String pointOfWithdrawal) {}
