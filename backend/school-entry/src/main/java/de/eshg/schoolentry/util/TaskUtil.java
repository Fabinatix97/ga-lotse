/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryTask;
import java.time.Clock;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class TaskUtil {

  private final Clock clock;

  public TaskUtil(Clock clock) {
    this.clock = clock;
  }

  public void addOpenTaskOfType(SchoolEntryProcedure schoolEntryProcedure, TaskType type) {
    SchoolEntryTask task = new SchoolEntryTask();
    task.assign(
        CurrentUserHelper.getCurrentUserId(),
        CurrentUserHelper.getCurrentUserId(),
        Instant.now(clock));
    task.setTaskStatus(TaskStatus.OPEN);
    task.setTaskType(type);
    schoolEntryProcedure.addTask(task);
  }

  public static void closeSingleTaskOfType(SchoolEntryProcedure procedure, TaskType type) {
    SchoolEntryTask taskToUpdate = procedure.getTaskOfType(type);
    taskToUpdate.setTaskStatus(TaskStatus.CLOSED);
  }

  public static void closeOptionalTaskOfType(SchoolEntryProcedure procedure, TaskType type) {
    procedure.getOptionalTaskOfType(type).ifPresent(task -> task.setTaskStatus(TaskStatus.CLOSED));
  }
}
