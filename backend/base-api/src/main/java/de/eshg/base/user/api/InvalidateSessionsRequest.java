/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record InvalidateSessionsRequest(@NotNull List<UUID> sessions) {}
