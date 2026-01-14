/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import jakarta.validation.constraints.NotNull;

public record ErrorResponseWithLocation(
    @NotNull ErrorCode errorCode, String message, @NotNull String errorLocation) {}
