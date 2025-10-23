/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import de.eshg.api.commons.OffsetPagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEventsResponse(
    @NotNull @Valid List<UserEventDto> elements, @NotNull boolean hasNext)
    implements OffsetPagedResponse<UserEventDto> {}
