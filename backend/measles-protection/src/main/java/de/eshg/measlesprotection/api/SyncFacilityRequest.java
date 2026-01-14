/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SyncFacilityRequest(
    @NotNull UUID fileStateId, @NotNull long facilityVersion, @NotNull long referenceVersion) {}
