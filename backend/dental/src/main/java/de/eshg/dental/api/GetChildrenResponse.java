/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetChildrenResponse(
    @Valid @NotNull List<ChildDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<ChildDto> {}
