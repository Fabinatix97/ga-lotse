/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.constraints.NotNull;

public record ErrorResponseWithLocation(
    @CanBeLogged @NotNull ErrorCode errorCode,
    @CanBeLogged String message,
    @CanBeLogged @NotNull String errorLocation) {}
