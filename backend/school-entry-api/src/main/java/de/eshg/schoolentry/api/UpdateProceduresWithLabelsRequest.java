/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
