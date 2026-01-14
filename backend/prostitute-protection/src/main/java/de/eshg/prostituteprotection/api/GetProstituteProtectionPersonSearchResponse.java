/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetProstituteProtectionPersonSearchResponse(
    @Valid @NotNull List<ProstituteProtectionProcedureSearchOverviewDto> elements,
    @NotNull long totalNumberOfElements)
    implements PagedResponse<ProstituteProtectionProcedureSearchOverviewDto> {}
