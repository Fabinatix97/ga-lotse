/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.api.commons.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetProphylaxisSessionResponse(
    @Valid @NotNull List<ProphylaxisSessionDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<ProphylaxisSessionDto> {}
