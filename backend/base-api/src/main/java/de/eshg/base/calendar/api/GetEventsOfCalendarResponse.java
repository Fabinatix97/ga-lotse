/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetEventsOfCalendarResponse(
    @NotNull UUID calendarId,
    @Valid @NotNull List<DetailedEventWithoutCalendarId> events,
    @Valid @NotNull List<ErrorResponseWithLocation> errorResponses) {}
