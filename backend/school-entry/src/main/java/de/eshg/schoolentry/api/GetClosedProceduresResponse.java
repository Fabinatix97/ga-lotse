/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetClosedProceduresResponse(@NotNull List<UUID> procedureIds) {}
