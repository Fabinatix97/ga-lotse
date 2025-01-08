/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.notification;

import de.eshg.rest.service.error.ErrorResponseWithLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MarkNotificationsAsReadResponse(
    @NotNull @Valid List<ErrorResponseWithLocation> errorResponses) {}
