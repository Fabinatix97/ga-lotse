/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.EnumSet;
import java.util.Map;

public record ValidateRequiredProcedureDataResponse(
    @NotNull @Valid Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas) {}
