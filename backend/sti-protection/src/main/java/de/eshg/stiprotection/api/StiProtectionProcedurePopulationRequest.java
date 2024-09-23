/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.constraints.NotNull;

public record StiProtectionProcedurePopulationRequest(
    @NotNull Integer numberOfEntitiesToPopulate) {}
