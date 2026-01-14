/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.measlesprotection.api.draft.OpenProcedureResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MeaslesProtectionProcedurePopulationResult(
    @NotNull @Valid List<OpenProcedureResponse> procedures, @NotNull long count) {}
