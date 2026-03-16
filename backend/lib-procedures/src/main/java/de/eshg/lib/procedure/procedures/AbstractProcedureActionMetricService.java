/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.ProcedureAction;
import de.eshg.lib.procedure.model.ProcedureActionMetric;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

public abstract class AbstractProcedureActionMetricService {
  protected final BusinessModule businessModule;

  protected AbstractProcedureActionMetricService(BusinessModule businessModule) {
    this.businessModule = businessModule;
  }

  public final ProcedureActionMetric getProcedureActionMetric(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return new ProcedureActionMetric(
        businessModule,
        getReferenceProcedureAction(timeRangeStart, timeRangeEnd),
        getRelatedProcedureActions(timeRangeStart, timeRangeEnd));
  }

  protected abstract ProcedureAction getReferenceProcedureAction(
      Instant timeRangeStart, Instant timeRangeEnd);

  @SuppressWarnings("java:S1172")
  protected List<ProcedureAction> getRelatedProcedureActions(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return Collections.emptyList();
  }
}
