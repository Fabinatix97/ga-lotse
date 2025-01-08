/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import java.util.List;
import java.util.Map;

public interface SummaryProvider<
    TaskT extends Task<ProcedureT>, ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>> {

  Map<Long, String> getTaskSummaries(List<TaskT> tasks);

  Map<Long, String> getProcedureSummaries(List<ProcedureT> procedures);
}
