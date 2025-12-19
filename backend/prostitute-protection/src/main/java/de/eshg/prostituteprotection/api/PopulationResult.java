/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PopulationResult(
    @NotNull @Valid List<CreateProstituteProtectionProcedureResponse> procedures,
    @NotNull long count) {}
