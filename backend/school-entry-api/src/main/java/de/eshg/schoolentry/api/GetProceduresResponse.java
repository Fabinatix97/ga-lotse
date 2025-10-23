/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.api.commons.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetSchoolEntryProceduresResponse")
public record GetProceduresResponse(
    @Valid @NotNull List<ProcedureDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<ProcedureDto> {}
