/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import java.util.List;
import java.util.Map;

public class SimpleSummaryProvider<
        TaskT extends Task<ProcedureT>, ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>>
    implements SummaryProvider<TaskT, ProcedureT> {

  private final String taskSummary;
  private final String procedureSummary;

  public SimpleSummaryProvider(String commonSummary) {
    this(commonSummary, commonSummary);
  }

  public SimpleSummaryProvider(String taskSummary, String procedureSummary) {
    this.taskSummary = taskSummary;
    this.procedureSummary = procedureSummary;
  }

  @Override
  public Map<Long, String> getTaskSummaries(List<TaskT> tasks) {
    return tasks.stream()
        .collect(StreamUtil.toLinkedHashMap(SequencedBaseEntity::getId, task -> taskSummary));
  }

  @Override
  public Map<Long, String> getProcedureSummaries(List<ProcedureT> procedures) {
    return procedures.stream()
        .collect(
            StreamUtil.toLinkedHashMap(SequencedBaseEntity::getId, procedure -> procedureSummary));
  }
}
