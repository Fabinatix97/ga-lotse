/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SyncPersonRequest(
    @NotNull UUID fileStateId, @NotNull long personVersion, @NotNull long referenceVersion) {}
