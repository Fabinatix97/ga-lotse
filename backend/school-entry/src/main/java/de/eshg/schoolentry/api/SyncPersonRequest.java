/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SyncPersonRequest(
    @NotNull UUID fileStateId, @NotNull long personVersion, @NotNull long referenceVersion) {}
