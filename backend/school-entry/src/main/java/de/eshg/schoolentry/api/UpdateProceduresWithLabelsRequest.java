/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record UpdateProceduresWithLabelsRequest(
    @Valid @NotEmpty Map<UUID, Long> procedureIdsAndVersion,
    @NotEmpty List<UUID> procedureLabels) {}
