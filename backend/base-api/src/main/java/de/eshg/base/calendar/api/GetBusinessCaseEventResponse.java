/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetBusinessCaseEventResponse(
    @Valid @NotNull DetailedEvent event,
    @Valid @NotNull List<ErrorResponseWithLocation> errorResponses) {}
