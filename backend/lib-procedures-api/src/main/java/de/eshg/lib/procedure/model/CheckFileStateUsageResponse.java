/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record CheckFileStateUsageResponse(@NotNull List<UUID> inUse) {}
