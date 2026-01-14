/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.procedure;

import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAggregatedRecentProceduresResponse(
    @NotNull @Valid List<ProcedureDto> procedures,
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
