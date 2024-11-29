/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        .collect(Collectors.toMap(SequencedBaseEntity::getId, task -> taskSummary));
  }

  @Override
  public Map<Long, String> getProcedureSummaries(List<ProcedureT> procedures) {
    return procedures.stream()
        .collect(Collectors.toMap(SequencedBaseEntity::getId, procedure -> procedureSummary));
  }
}
