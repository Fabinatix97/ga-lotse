/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;

public interface SummaryProvider<
    TaskT extends Task<ProcedureT>, ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>> {

  String getTaskSummary(TaskT task);

  String getProcedureSummary(ProcedureT procedure);
}
