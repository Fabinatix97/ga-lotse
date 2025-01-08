/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.base.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetSchoolEntryProceduresResponse")
public record GetProceduresResponse(
    @Valid @NotNull List<ProcedureDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<ProcedureDto> {}
