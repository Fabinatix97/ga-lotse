/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetProstituteProtectionProceduresResponse(
    @Valid @NotNull List<ProstituteProtectionProcedureOverviewDto> elements,
    @NotNull long totalNumberOfElements)
    implements PagedResponse<ProstituteProtectionProcedureOverviewDto> {}
