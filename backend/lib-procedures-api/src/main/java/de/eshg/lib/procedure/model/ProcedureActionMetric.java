/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProcedureActionMetric(
    @NotNull BusinessModule businessModule,
    @NotNull @Valid ProcedureAction referenceProcedureAction,
    @NotNull @Valid List<ProcedureAction> relatedProcedureActions) {}
