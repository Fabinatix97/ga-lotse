/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.dto;

import jakarta.validation.constraints.NotNull;

public record DeactivateRequest(@NotNull String matrixUserId) {}
