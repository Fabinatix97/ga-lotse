/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateProcedureRequest(
    @Valid @NotNull CreatePersonDto child, @NotNull ProcedureTypeDto type) {}
