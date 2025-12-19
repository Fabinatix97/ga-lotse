/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SyncFacilityRequest(
    @NotNull UUID fileStateId, @NotNull long facilityVersion, @NotNull long referenceVersion) {}
