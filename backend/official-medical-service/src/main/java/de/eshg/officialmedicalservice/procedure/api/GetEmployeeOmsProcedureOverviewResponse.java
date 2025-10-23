/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
