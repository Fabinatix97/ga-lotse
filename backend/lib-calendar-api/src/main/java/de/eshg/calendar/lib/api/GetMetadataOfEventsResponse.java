/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.calendar.lib.api;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetMetadataOfEventsResponse(
    @NotNull BusinessModule businessModule,
    @Valid @NotNull List<EventWithMetaData> existingEventsWithMetaData,
    @NotNull List<UUID> notFoundEventIds) {}
