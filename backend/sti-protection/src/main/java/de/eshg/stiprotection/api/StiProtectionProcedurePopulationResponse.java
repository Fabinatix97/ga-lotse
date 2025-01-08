/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record StiProtectionProcedurePopulationResponse(
    @Valid List<CreateProcedureResponse> procedures, @NotNull long count) {}
