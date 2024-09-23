/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SchoolEntryProcedurePopulationResult(
    @Valid List<CreateProcedureResponse> procedures, @NotNull long count) {}
