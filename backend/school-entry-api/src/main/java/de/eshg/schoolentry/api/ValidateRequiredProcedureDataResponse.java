/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.EnumSet;
import java.util.Map;

public record ValidateRequiredProcedureDataResponse(
    @NotNull @Valid Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> incompleteAreas) {}
