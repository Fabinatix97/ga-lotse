/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.housekeeping.archiving.ArchivingProperties;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ProcedureLibraryEnrichingMapper<
    ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>> {

  private final BusinessModule businessModule;
  private final SummaryProvider<TaskT, ProcedureT> summaryProvider;
  private final ArchivingProperties archivingProperties;
  private final Clock clock;

  public ProcedureLibraryEnrichingMapper(
      BusinessModule businessModule,
      SummaryProvider<TaskT, ProcedureT> summaryProvider,
      ArchivingProperties archivingProperties,
      Clock clock) {
    this.businessModule = businessModule;
    this.summaryProvider = summaryProvider;
    this.archivingProperties = archivingProperties;
    this.clock = clock;
  }

  public List<ProcedureDto> enrichAndMapProcedures(List<ProcedureT> procedures) {
    Map<Long, String> procedureSummaries = summaryProvider.getProcedureSummaries(procedures);

    return procedures.stream()
        .map(
            procedure ->
                ProcedureMapper.toInterfaceType(
                    procedure,
                    businessModule,
                    procedureSummaries.get(procedure.getId()),
                    archivingProperties.getDefaultArchivingRelevanceOrElseFallback(
                        procedure.getProcedureType())))
        .toList();
  }

  public List<TaskDto> enrichAndMapTasks(List<TaskT> tasks) {
    Map<Long, String> taskSummaries = summaryProvider.getTaskSummaries(tasks);

    return tasks.stream()
        .map(
            task ->
                TaskMapper.toInterfaceType(
                    task, businessModule, taskSummaries.get(task.getId()), isOverdue(task)))
        .toList();
  }

  private boolean isOverdue(Task<?> domainModelTask) {
    Instant dueAt = domainModelTask.getDueAt();

    if (Objects.isNull(dueAt)) {
      return false;
    }

    return !dueAt.isAfter(Instant.now(clock))
        && domainModelTask.getTaskStatus() != TaskStatus.CLOSED;
  }
}
