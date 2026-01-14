/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.notification;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetAggregatedNotificationsResponse(
    @NotNull @Valid List<AbstractNotificationDto> notifications,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers,
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
