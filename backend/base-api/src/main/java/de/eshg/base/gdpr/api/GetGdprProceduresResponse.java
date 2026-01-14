/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import de.eshg.api.commons.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGdprProceduresResponse(
    @Valid @NotNull List<GetGdprProcedureResponse> elements,
    @Schema(description = "The total number of GDPR procedures in the response.") @NotNull
        long totalNumberOfElements)
    implements PagedResponse<GetGdprProcedureResponse> {}
