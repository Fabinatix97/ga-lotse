/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateProcedureRequest(
    @Valid @NotNull CreatePersonDto child, @NotNull ProcedureTypeDto type) {}
