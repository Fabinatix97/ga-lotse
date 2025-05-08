/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SyncCustodianRequest(
    @NotNull UUID fileStateId, @NotNull long custodianVersion, @NotNull long referenceVersion) {}
