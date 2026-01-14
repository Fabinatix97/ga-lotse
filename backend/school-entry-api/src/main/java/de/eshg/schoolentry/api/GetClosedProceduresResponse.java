/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetClosedProceduresResponse(@NotNull List<UUID> procedureIds) {}
