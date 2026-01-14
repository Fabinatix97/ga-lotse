/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEmployeeOmsProcedureOverviewResponse(
    @Valid @NotNull List<EmployeeOmsProcedureOverviewDto> elements,
    @NotNull long totalNumberOfElements,
    @NotNull int medicalOpinionLeadTime)
    implements PagedResponse<EmployeeOmsProcedureOverviewDto> {}
