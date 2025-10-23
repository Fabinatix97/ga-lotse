/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SchoolEntryProcedurePopulationResult(
    @NotNull @Valid List<CreateProcedureResponse> procedures, @NotNull long count) {}
