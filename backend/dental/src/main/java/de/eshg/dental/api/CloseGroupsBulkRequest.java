/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record CloseGroupsBulkRequest(
    @NotNull UUID institutionId,
    @NotEmpty List<String> groupNames,
    @NotNull boolean includeChildrenWithoutGroup) {}
