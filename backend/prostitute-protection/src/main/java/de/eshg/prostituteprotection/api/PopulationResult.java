/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PopulationResult(
    @NotNull @Valid List<CreateProstituteProtectionProcedureResponse> procedures,
    @NotNull long count) {}
