/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetInfectionBriefingProceduresResponse(
    @Valid @NotNull List<InfectionBriefingProcedureDto> elements,
    @Min(0) @NotNull long totalNumberOfElements)
    implements PagedResponse<InfectionBriefingProcedureDto> {}
