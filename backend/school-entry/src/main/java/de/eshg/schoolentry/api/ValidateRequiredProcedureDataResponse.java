/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

public record ValidateRequiredProcedureDataResponse(
    // Should be removed once it is not used by the frontend anymore. Use errors instead
    @NotNull List<RequiredProcedureArea> incompleteAreas,
    @NotNull @Valid Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> errors) {}
