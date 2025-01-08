/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import jakarta.validation.constraints.NotNull;

public record ErrorResponse(@NotNull ErrorCode errorCode, String message) {}
