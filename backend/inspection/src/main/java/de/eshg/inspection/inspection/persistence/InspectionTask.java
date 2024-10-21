/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Clock;
import java.util.UUID;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class InspectionTask extends Task<Inspection> {

  public static InspectionTask newPlanningTask(UUID assigneeId, Clock clock) {
    return createInspectionTask(TaskType.INSPECTION_PLANNING, assigneeId, clock);
  }

  public static InspectionTask newExecutionTask(UUID assigneeId, Clock clock) {
    return createInspectionTask(TaskType.INSPECTION_EXECUTION, assigneeId, clock);
  }

  public static InspectionTask newReportTask(UUID assigneeId, Clock clock) {
    return createInspectionTask(TaskType.INSPECTION_REPORT, assigneeId, clock);
  }

  private static InspectionTask createInspectionTask(
      TaskType taskType, UUID assigneeId, Clock clock) {
    InspectionTask task = new InspectionTask();
    task.setTaskType(taskType);
    task.setTaskStatus(TaskStatus.OPEN);
    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    task.assign(assigneeId, currentUserId, clock.instant());
    return task;
  }
}
