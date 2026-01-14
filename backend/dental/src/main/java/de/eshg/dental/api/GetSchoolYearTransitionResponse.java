/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetSchoolYearTransitionResponse(
    @Valid @NotNull List<InstitutionForTransitionDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<InstitutionForTransitionDto> {}
