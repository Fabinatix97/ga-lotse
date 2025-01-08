/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InspPendingFacility")
public record InspPendingFacilityDto(
    @NotNull UUID id,
    @NotNull UUID centralFileStateId,
    InspPendingFacilityKind kind,
    @NotBlank String name,
    @NotBlank String street,
    String houseNo,
    String addressAddition,
    @NotBlank String postalCode,
    @NotBlank String city,
    Instant plannedFrom,
    @Valid ObjectTypeRefDto objecttype,
    @Valid InsPendingFacilityInspectionDto inspection,
    @NotNull boolean possibleFacilityDuplicate,
    Instant executedFrom) {}
