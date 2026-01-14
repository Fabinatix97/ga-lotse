/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import de.eshg.api.commons.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "InspPendingFacilitiesOverviewResponse")
public record InspPendingFacilitiesOverviewResponse(
    @NotNull int totalPages,
    @NotNull long totalNumberOfElements,
    @NotNull @Valid List<InspPendingFacilityDto> elements,
    @NotNull long numberOfPossibleDuplicates)
    implements PagedResponse<InspPendingFacilityDto> {}
